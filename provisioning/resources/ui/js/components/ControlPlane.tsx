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

export class ControlPlane extends React.Component<{}, {}> {

  public render() {

    return (
      <div className="tab-content">
        <p>Press the buttons for controlling the Snowplow-Mini without ssh:<br></br></p>
        <h4>Restart all services:</h4>
        <button type="button" title="Clear the cache for schemas" onClick={this.restartAllServices.bind(this) }>Restart all services</button>
        <h4>Upload enrichments json file:</h4>
        <form encType="multipart/form-data" action="/controlplane/uploadenrichments" method="post">
             <table>
              <tbody>
                <tr>
                  <td><input type="file" name="enrichmentjson" /></td>
                </tr>
                <tr>
                  <td><input type="submit" value="upload enrichment json file" /></td>
                </tr>
              </tbody>
            </table>             
        </form>
        <h4>Add external Iglu Server:</h4>
        <form action="/controlplane/addexternaligluserver" method="post">
            <table>
              <tbody>
                <tr>
                  <td>Iglu Server URI:  <input type="text" name="iglu_server_uri" /></td>
                </tr>
                <tr>
                  <td>Iglu Server Apikey:  <input type="text" name="iglu_server_apikey" /></td>
                </tr>
                <tr>
                  <td><input type="submit" value="add external iglu server" /></td>
                </tr>
              </tbody>
            </table>            
        </form>
        <h4>Add super UUID for local Iglu Server:</h4>
        <form action="/controlplane/addigluserversuperuuid" method="post">
            <table>
              <tbody>
                <tr>
                  <td>Iglu Server Super UUID:  <input type="text" name="iglu_server_super_uuid" /></td>
                </tr>
                <tr>
                  <td><input type="submit" value="add UUID" /></td>
                </tr>
              </tbody>
            </table>            
        </form>
        <h4>Change username and password for basic http authentication:</h4>
        <form action="/controlplane/changeusernameandpassword" method="post">
            <table>
              <tbody>
                <tr>
                  <td>Username:  <input type="text" name="new_username" /></td>
                </tr>
                <tr>
                  <td>Password:  <input type="text" name="new_password" /></td>
                </tr>
                <tr>
                  <td><input type="submit" value="submit" /></td>
                </tr>
              </tbody>
            </table>            
        </form>
         <p>NOTE: You will lose connection after change the username and password because of server restarting. 
            Get back to previous page after submission and login with your new username and password.
         </p>
        
      </div>
    );
  }



  private restartAllServices(): void {
    alert("Restarting all services...")

    axios.put('/controlplane/restartspservices', {}, {})
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error);
     });
  }
}
