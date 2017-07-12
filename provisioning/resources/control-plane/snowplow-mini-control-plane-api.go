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
    http.HandleFunc("/addigluserversuperuuid", addIgluServerSuperUUID)
    http.HandleFunc("/changeusernameandpassword", changeUsernameAndPassword)
    http.HandleFunc("/adddomainname", addDomainName)
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

func addIgluServerSuperUUID(resp http.ResponseWriter, req *http.Request) {
    if req.Method == "POST" {
        req.ParseForm()
        igluServerSuperUUID := req.Form["iglu_server_super_uuid"][0]

        shellScriptCommand := []string{scriptsPath + "/" +  "add_iglu_server_super_uuid.sh", 
                                       igluServerSuperUUID, 
                                       configPath}
        cmd := exec.Command("/bin/bash", shellScriptCommand...)
        err := cmd.Run()
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        //restart SP services 
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

func changeUsernameAndPassword(resp http.ResponseWriter, req *http.Request) {
    if req.Method == "POST" {
        req.ParseForm()
        newUsername := req.Form["new_username"][0]
        newPassword := req.Form["new_password"][0]

        shellScriptCommand := []string{scriptsPath + "/" +  "submit_username_password_for_basic_auth.sh",
                                       newUsername, 
                                       newPassword,
                                       configPath}
        cmd := exec.Command("/bin/bash", shellScriptCommand...)
        err := cmd.Run()
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        //restart SP services 
        _, err = callRestartSPServicesScript()
        resp.WriteHeader(http.StatusOK)
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        resp.WriteHeader(http.StatusOK)
        io.WriteString(resp, "changed successfully")
    }
}

func addDomainName(resp http.ResponseWriter, req *http.Request) {
    if req.Method == "POST" {
        req.ParseForm()
        tlsStatus := req.Form["tls_status"][0]
        domainName := req.Form["domain_name"][0]

        shellScriptCommand := []string{scriptsPath + "/" +  "write_domain_name_to_caddyfile.sh", 
                                       tlsStatus, 
                                       domainName,
                                       configPath}
        cmd := exec.Command("/bin/bash", shellScriptCommand...)
        err := cmd.Run()
        if err != nil {
            http.Error(resp, err.Error(), 400)
            return
        }
        //restart SP services 
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
