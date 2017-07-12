package main

import (
    "io"
    "net/http"
    "log"
    "os/exec"
	"os"
    "flag"
)


//global variable for script's path
var scriptsPath string
var enrichmentsPath string
var configPath string

func main() {
    scriptsPathFlag := flag.String("scriptsPath", "", "path for control-plane-api scripts")
	enrichmentsPathFlag := flag.String("enrichmentsPath", "", "path for enrichment files")
    configPathFlag := flag.String("configPath", "", "path for config files")
    flag.Parse()
    scriptsPath = *scriptsPathFlag
	enrichmentsPath = *enrichmentsPathFlag
    configPath = *configPathFlag

	http.HandleFunc("/restartspservices", restartSPServices)
    http.HandleFunc("/uploadenrichments", uploadEnrichments)
    http.HandleFunc("/addexternaligluserver", addExternalIgluServer)
    log.Fatal(http.ListenAndServe(":10000", nil))
}

func callRestartSPServicesScript() (string, error){
    shellScriptCommand := []string{scriptsPath + "/" +  "restart_SP_services.sh"}
    cmd := exec.Command("/bin/bash", shellScriptCommand...)
    err := cmd.Run()
    if err != nil {
        return "ERR", err
    }
    return "OK", err

}

func restartSPServices(resp http.ResponseWriter, req *http.Request) {
    if (req.Method == "PUT") {
        _, err := callRestartSPServicesScript()
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }else {
            resp.WriteHeader(http.StatusOK)
            io.WriteString(resp, "OK")
        }
    }
}

func uploadEnrichments(resp http.ResponseWriter, req *http.Request) {
    if req.Method == "POST" {
        req.ParseMultipartForm(32 << 20)
		file, handler, err := req.FormFile("enrichmentjson")
		if err != nil {
            http.Error(resp, err.Error(), 400)
			return
		}
		defer file.Close()
        f, err := os.OpenFile(enrichmentsPath + "/" + handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        defer f.Close()
        io.Copy(f, file)
        //restart SP services to get action the enrichments 
        _, err = callRestartSPServicesScript()
        resp.WriteHeader(http.StatusOK)
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        resp.WriteHeader(http.StatusOK)
        io.WriteString(resp, "uploaded successfully")
        return
    }
}

func addExternalIgluServer(resp http.ResponseWriter, req *http.Request) {
    if req.Method == "POST" {
        req.ParseForm()
        igluServerUri := req.Form["iglu_server_uri"][0]
        igluServerApikey := req.Form["iglu_server_apikey"][0]

        shellScriptCommand := []string{scriptsPath + "/" +  "add_external_iglu_server.sh",
                                       igluServerUri,
                                       igluServerApikey,
                                       configPath,
                                       scriptsPath}
        cmd := exec.Command("/bin/bash", shellScriptCommand...)
        err := cmd.Run()
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        //restart SP services to get action the external iglu server 
        _, err = callRestartSPServicesScript()
        resp.WriteHeader(http.StatusOK)
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        resp.WriteHeader(http.StatusOK)
        io.WriteString(resp, "added successfully")
    }
}

