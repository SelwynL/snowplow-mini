/*
 * Copyright (c) 2016 Snowplow Analytics Ltd. All rights reserved.
 *
 * This program is licensed to you under the Apache License Version 2.0,
 * and you may not use this file except in compliance with the Apache License Version 2.0.
 * You may obtain a copy of the Apache License Version 2.0 at http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the Apache License Version 2.0 is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Apache License Version 2.0 for the specific language governing permissions and limitations there under.
 */

/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />
/// <reference path=".././Interfaces.d.ts"/>

import React = require("react");
import ReactDOM = require("react-dom");
import axios from 'axios';
import AlertContainer from 'react-alert';
import { UploadEnrichmentsForm, AddExternalIgluServerForm,
         AddIgluServerSuperUUIDForm, ChangeUsernamePasswordForm, AddDomainNameForm
       }  from "./AllForms";


export class ControlPlane extends React.Component<{}, {}> {

  msg = new AlertContainer();

  alertOptions = {
    offset: 14,
    position: 'top right',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }


  public render() {

    return (
      <div className="tab-content">
        <p>Press the buttons for controlling the Snowplow-Mini without ssh:<br></br></p>
        <div className="tab-content">        
          <h4>Restart all services:</h4>
          <button type="button" title="Clear the cache for schemas" onClick={this.restartAllServices.bind(this) }>Restart all services</button>
        </div>
        <UploadEnrichmentsForm />
        <AddExternalIgluServerForm />  
        <AddIgluServerSuperUUIDForm />  
        <ChangeUsernamePasswordForm />  
        <AddDomainNameForm />  
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />        
      </div>
    );
  }


  

  private restartAllServices(): void {
      var alertShow = this.msg.show 
      alertShow('Restarting all services...', {
        time: 2000,
        type: 'info'
      });
 
    axios.put('/controlplane/restartspservices', {}, {})
    .then(function (response) {
        alertShow('All services restarted successfully', {
          time: 4000,
          type: 'success'
        });
    })
    .catch(function (error) {
        alertShow('Error while restarting services', {
          time: 4000,
          type: 'error'
        });
     });
  }
}
