package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func handleHello(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	if username == "error" {
		http.Error(w, "Error", http.StatusInternalServerError)
	} else {
		fmt.Fprintf(w, "Hello, %s!", username)
	}
}

func handleJson(w http.ResponseWriter, r *http.Request) {
	type Test struct {
		name string
		T    bool `json:"test"`
	}
	json.NewEncoder(w).Encode(Test{T: true, name: "name"})
}

func fileUpload(w http.ResponseWriter, r *http.Request) (string, error) {
	enableCors(&w)

	r.ParseMultipartForm(32 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		return "", err
	}
	defer file.Close()

	f, err := os.OpenFile("../static/"+header.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return "", err
	}
	defer f.Close()
	io.Copy(f, file)

	return header.Filename, nil
}

func uploadImageHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		fileUpload(w, r)
	}

}

func main() {
	const port = ":8080"
	fmt.Printf("Listening on port %s", port)
	http.Handle("/", http.FileServer(http.Dir("../static")))
	http.HandleFunc("/hello", handleHello)
	http.HandleFunc("/json", handleJson)
	http.HandleFunc("/upload-image", uploadImageHandler)
	http.ListenAndServe(port, nil)
}
