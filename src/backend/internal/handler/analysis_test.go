package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"image"
	"image/jpeg"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pp-sem6-team/backend/internal/db/model"
	"github.com/pp-sem6-team/backend/internal/domain"
	"github.com/pp-sem6-team/backend/internal/dto"
	"github.com/pp-sem6-team/backend/internal/integration/ml"
	"github.com/pp-sem6-team/backend/internal/integration/storage"
	"github.com/pp-sem6-team/backend/internal/logger"
	"github.com/pp-sem6-team/backend/internal/middleware"
	"github.com/pp-sem6-team/backend/internal/repository"
	"github.com/pp-sem6-team/backend/internal/service"
	"go.uber.org/zap"
)

type photoRepositoryStub struct {
	repository.PhotoRepository
	photo *model.Photo
}

func (s *photoRepositoryStub) Create(_ context.Context, photo *model.Photo) error {
	photo.UploadedAt = time.Date(2026, 11, 23, 12, 0, 0, 0, time.UTC)
	s.photo = photo
	return nil
}

type analysisRepositoryStub struct {
	repository.AnalysisRepository
	created *model.Analysis
	updated chan *model.Analysis
}

func (s *analysisRepositoryStub) Create(_ context.Context, analysis *model.Analysis) error {
	copy := *analysis
	s.created = &copy
	return nil
}
func (s *analysisRepositoryStub) Update(_ context.Context, analysis *model.Analysis) error {
	s.updated <- analysis
	return nil
}

type storageStub struct {
	storage.Storage
	key         string
	data        []byte
	size        int64
	contentType string
}

func (s *storageStub) Upload(_ context.Context, key string, r io.Reader, size int64, contentType string) error {
	s.key, s.size, s.contentType = key, size, contentType
	var err error
	s.data, err = io.ReadAll(r)
	return err
}
func (s *storageStub) GetPresignedURL(_ context.Context, _ string, _ time.Duration) (string, error) {
	return "https://storage.example/photo.jpg", nil
}

type mlClientStub struct{ ml.Client }

func (s *mlClientStub) Analyze(_ context.Context, _ string, _ []byte) (*ml.Result, error) {
	return &ml.Result{SkinType: domain.SkinType("normal")}, nil
}

var analysisTestSetup sync.Once

func analysisRouter(userID uuid.UUID, photos *photoRepositoryStub, analyses *analysisRepositoryStub, files *storageStub) *gin.Engine {
	analysisTestSetup.Do(func() {
		gin.SetMode(gin.TestMode)
		logger.Log = zap.NewNop()
	})
	svc := service.NewAnalysisService(photos, analyses, nil, nil, nil, &mlClientStub{}, files, time.Hour)
	router := gin.New()
	router.POST("/analyses", func(c *gin.Context) {
		c.Set(string(middleware.UserIDKey), userID)
		c.Next()
	}, NewAnalysisHandler(svc).CreateAnalysis)
	return router
}

func photoRequest(t *testing.T, filename string, data []byte) *http.Request {
	t.Helper()
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	part, err := writer.CreateFormFile("photo", filename)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := part.Write(data); err != nil {
		t.Fatal(err)
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodPost, "/analyses", &body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req
}

func TestCreateAnalysisAcceptsJPG(t *testing.T) {
	userID := uuid.New()
	photos := &photoRepositoryStub{}
	analyses := &analysisRepositoryStub{updated: make(chan *model.Analysis, 1)}
	files := &storageStub{}
	router := analysisRouter(userID, photos, analyses, files)
	var photo bytes.Buffer
	if err := jpeg.Encode(&photo, image.NewRGBA(image.Rect(0, 0, 2, 2)), nil); err != nil {
		t.Fatal(err)
	}
	response := httptest.NewRecorder()
	router.ServeHTTP(response, photoRequest(t, "photo.jpg", photo.Bytes()))
	if response.Code != http.StatusAccepted {
		t.Fatalf("status = %d, want %d; body: %s", response.Code, http.StatusAccepted, response.Body.String())
	}
	var result dto.CreateAnalysisResponse
	if err := json.Unmarshal(response.Body.Bytes(), &result); err != nil {
		t.Fatal(err)
	}
	if photos.photo == nil || analyses.created == nil {
		t.Fatal("photo and analysis must be saved")
	}
	if result.ID == uuid.Nil || result.ID != analyses.created.ID || result.PhotoID != photos.photo.ID || analyses.created.PhotoID != result.PhotoID {
		t.Fatalf("response IDs do not match saved records: %+v", result)
	}
	if result.Status != domain.Processing || analyses.created.Status != domain.Processing {
		t.Fatalf("status = %q, want processing", result.Status)
	}
	if result.FileURL != "https://storage.example/photo.jpg" || !result.UploadedAt.Equal(photos.photo.UploadedAt) {
		t.Fatalf("unexpected photo URL or upload time: %+v", result)
	}
	if photos.photo.UserID != userID || files.key != photos.photo.ObjectKey || !strings.HasPrefix(files.key, "users/"+userID.String()+"/photos/") || !strings.HasSuffix(files.key, ".jpg") {
		t.Fatal("photo must be stored under the authenticated user's key")
	}
	if !bytes.Equal(files.data, photo.Bytes()) || files.size != int64(photo.Len()) || files.contentType != "image/jpeg" {
		t.Fatal("uploaded content, size or MIME type differs from input")
	}
	select {
	case updated := <-analyses.updated:
		if updated.ID != result.ID || updated.Status != domain.Completed {
			t.Fatalf("unexpected background update: %+v", updated)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("background analysis did not finish")
	}
}

func TestCreateAnalysisRejectsTXT(t *testing.T) {
	photos := &photoRepositoryStub{}
	analyses := &analysisRepositoryStub{updated: make(chan *model.Analysis, 1)}
	files := &storageStub{}
	router := analysisRouter(uuid.New(), photos, analyses, files)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, photoRequest(t, "photo.txt", []byte("This is not a photo.")))
	if response.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body: %s", response.Code, http.StatusBadRequest, response.Body.String())
	}
	var result dto.ErrorResponse
	if err := json.Unmarshal(response.Body.Bytes(), &result); err != nil {
		t.Fatal(err)
	}
	if result.Code != "INVALID_FILE_TYPE" || result.Message != "invalid file type" {
		t.Fatalf("unexpected error response: %+v", result)
	}
	if files.key != "" || photos.photo != nil || analyses.created != nil {
		t.Fatal("unsupported file must not be uploaded or saved")
	}
}
