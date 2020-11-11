package main

import (
  "net/http"
)

func main() {
  http.Handle("/", http.FileServer(http.Dir(".")))
  if err := http.ListenAndServe(":8081", nil); err != nil {
    panic(err)
  }
}
