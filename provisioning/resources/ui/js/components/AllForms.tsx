/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />
/// <reference path=".././Interfaces.d.ts"/>

import React = require('react');
import ReactDOM = require("react-dom");
import AlertContainer from 'react-alert';
import axios from 'axios';


//export class ContactForm extends React.Component<{}, {}> {
var alertContainer = new AlertContainer();
var alertOptions = {
    offset: 14,
    position: 'top right',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }
 

export var UploadEnrichmentsForm = React.createClass({ 


    getInitialState () {
        return {
            data: new FormData()
        };
    },

    uploadNewFile(evt) {
        this.state.data.append('enrichmentjson', evt.target.files[0])
    },


   sendFormData()  {
        var alertShow = alertContainer.show 
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        axios.post('/controlplane/uploadenrichments', this.state.data, {})
        .then(function (response) {
            if (response.status === 200) {
                alertShow('Uploaded successfully', {
                    time: 2000,
                    type: 'success'
                });
            } else {
                alertShow('Error while uploading', {
                    time: 2000,
                    type: 'error'
                });            
            }
        })
        .catch(function (error) {
            alertShow('Error while uploading', {
                time: 2000,
                type: 'error'
            }); 
        });
    },

    handleSubmit(event) {
        event.preventDefault();
        this.sendFormData();
    },

    render() {

        return (
            <div className="tab-content">
                <h4>Upload enrichments json file:</h4>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input className="form-control" name="enrichmentjson" ref="enrichmentjson" required type="file" onChange={this.uploadNewFile}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Upload enrichment json file</button>
                    </div>
                </form> 
                <AlertContainer ref={a => alertContainer = a} {...alertOptions} />
            </div>
        );  
    }
});



export var AddExternalIgluServerForm = React.createClass({ 


    getInitialState () {
        return {
                iglu_server_uri: '',
                iglu_server_apikey: ''
           };
    },

    handleChange(evt) {
        if (evt.target.name == 'iglu_server_uri'){
            this.setState({
                iglu_server_uri: evt.target.value
            });
        }
        else if (evt.target.name == 'iglu_server_apikey'){
            this.setState({
                iglu_server_apikey: evt.target.value
            });
        }
    },

    sendFormData()  {
        var alertShow = alertContainer.show 
        var params = new URLSearchParams();
        params.append('iglu_server_uri', this.state.iglu_server_uri)
        params.append('iglu_server_apikey', this.state.iglu_server_apikey)
    
        var _this = this
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
        axios.post('/controlplane/addexternaligluserver', params, {})
        .then(function (response) {
            _this.setState({
                iglu_server_uri: "",
                iglu_server_apikey: ""
            });

            if (response.status === 200) {
                alertShow('Uploaded successfully', {
                    time: 2000,
                    type: 'success'
                });
            } else {
                alertShow('Error while uploading', {
                    time: 2000,
                    type: 'error'
                });            
            }
        })
        .catch(function (error) {
            alertShow('Error while uploading', {
                time: 2000,
                type: 'error'
            }); 
        });
    },

    handleSubmit(event) {
        event.preventDefault();
        this.sendFormData();
    },

    render() {

        return (
            <div className="tab-content">
                <h4>Add external Iglu Server: </h4>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="iglu_server_uri">Iglu Server URI: </label>
                        <input className="form-control" name="iglu_server_uri" ref="iglu_server_uri" required type="text" onChange={this.handleChange} value={this.state.iglu_server_uri} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="iglu_server_apikey">Iglu Server ApiKey: </label>
                        <input className="form-control" name="iglu_server_apikey" ref="iglu_server_apikey" required type="text" onChange={this.handleChange} value={this.state.iglu_server_apikey}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Add External Iglu Server</button>
                    </div>
                </form> 
                <AlertContainer ref={a => alertContainer = a} {...alertOptions} />                
            </div>
        );
    }
});

export var AddIgluServerSuperUUIDForm = React.createClass({ 


    getInitialState () {
        return {
            iglu_server_super_uuid: ''
        };
    },

    handleChange(evt) {
        this.setState({
            iglu_server_super_uuid: evt.target.value
        });
    },


    sendFormData()  {
        var alertShow = alertContainer.show 
        var params = new URLSearchParams();
        params.append('iglu_server_super_uuid', this.state.iglu_server_super_uuid)
    
        var _this = this
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
        axios.post('/controlplane/addigluserversuperuuid', params, {})
        .then(function (response) {
            if (response.status === 200) {
                _this.setState({
                    iglu_server_super_uuid: ''
                });

                alertShow('Uploaded successfully', {
                    time: 2000,
                    type: 'success'
                });
            } else {
                alertShow('Error while uploading', {
                    time: 2000,
                    type: 'error'
                });            
            }
        })
        .catch(function (error) {
            alertShow('Error while uploading', {
                time: 2000,
                type: 'error'
            }); 
        });
    },

    handleSubmit(event) {
        event.preventDefault();
        this.sendFormData();
    },

    render() {

        return (
            <div className="tab-content">
                <h4>Add super UUID for local Iglu Server: </h4>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="iglu_server_super_uuid">Iglu Server Super UUID: </label>
                        <input className="form-control" name="iglu_server_super_uuid" ref="iglu_server_super_uuid" required type="text" onChange={this.handleChange} value={this.state.iglu_server_super_uuid} />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Add UUID</button>
                    </div>
                </form> 
                <AlertContainer ref={a => alertContainer = a} {...alertOptions} />                
            </div>
        );
    }
});

export var ChangeUsernamePasswordForm = React.createClass({ 


    getInitialState () {
        return {
            new_username: '',
            new_password: ''
        };
    },

    handleChange(evt) {
        if (evt.target.name == 'new_username'){
            this.setState({
                new_username: evt.target.value
            });
        }
        else if (evt.target.name == 'new_password'){
            this.setState({
                new_password: evt.target.value
            });
        }
    },


    sendFormData()  {
        var alertShow = alertContainer.show 
        var params = new URLSearchParams();
        params.append('new_username', this.state.new_username)
        params.append('new_password', this.state.new_password)
        
        var _this = this
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
        axios.post('/controlplane/changeusernameandpassword', params, {})
        .then(function (response) {

        })
        .catch(function (error) {
            _this.setState({
                new_password: "",
                new_username: ""
            });

            alertShow("You will lose connection after change the username and \
                       password because of server restarting. Reload the page  \
                       after submission and login with your new username and password.", {
                    time: 10000,
                    type: 'info'
            });   
        });
    },

    handleSubmit(event) {
        event.preventDefault();
        this.sendFormData();
    },

    render() {

        return  (
            <div className="tab-content">
                <h4>Change username and password for basic http authentication: </h4>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="new_username">Username: </label>
                        <input className="form-control" name="new_username" ref="new_username" required type="text" onChange={this.handleChange} value={this.state.new_username} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new_password">Password: </label>
                        <input className="form-control" name="new_password" ref="new_password" required type="password" onChange={this.handleChange} value={this.state.new_password} />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                </form> 
                <AlertContainer ref={a => alertContainer = a} {...alertOptions} />                
            </div>
        );
    }

});


export var AddDomainNameForm = React.createClass({ 


    getInitialState () {
        return {
            domain_name: ''
        };
    },

    handleChange(evt) {
        if (evt.target.name == 'domain_name'){
            this.setState({
                domain_name: evt.target.value
            });
        }
    },


    sendFormData()  {
        var alertShow = alertContainer.show 
        var params = new URLSearchParams();
        params.append('domain_name', this.state.domain_name);
        params.append('tls_status', "on");
        
        var _this = this;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post('/controlplane/adddomainname', params, {})
        .then(function (response) {
        })
        .catch(function (error) {
            _this.setState({
                domain_name: "",
            });

            alertShow('You will lose connection after submitting the domain name \
                       because of server restarting. Reload the page after submission.', {
                time: 10000,
                type: 'info'
            }); 
        });
    },

    handleSubmit(event) {
        event.preventDefault();
        this.sendFormData();
    },

    render() {

        return  (
            <div className="tab-content">
                <h4>Add domain name for TLS: </h4>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="domain_name">Domain name: </label>
                        <input className="form-control" name="domain_name" ref="domain_name" required type="text" onChange={this.handleChange} value={this.state.domain_name} />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                </form> 
                <AlertContainer ref={a => alertContainer = a} {...alertOptions} />                
            </div>
        );
    }
});
