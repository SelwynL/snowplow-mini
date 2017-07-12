#!/bin/bash

testDir=$1
testEnv="$testDir/testEnv"
testInit="$testDir/testInit"

sudo cp $testInit/snowplow_mini_control_plane_api_test_init /etc/init.d/snowplow_mini_control_plane_api
sudo /etc/init.d/snowplow_mini_control_plane_api restart $testDir 
sleep 2

## restart SP services test
stream_enrich_pid_file=/var/run/snowplow_stream_enrich_0.10.0.pid
stream_collector_pid_file=/var/run/snowplow_stream_collector_0.9.0.pid
sink_bad_pid_file=/var/run/snowplow_elasticsearch_sink_bad_0.8.0-2x.pid
sink_good_pid_file=/var/run/snowplow_elasticsearch_sink_good_0.8.0-2x.pid


stream_enrich_pid_old="$(cat "${stream_enrich_pid_file}")"
stream_collector_pid_old="$(cat "${stream_collector_pid_file}")"
sink_bad_pid_old="$(cat "${sink_bad_pid_file}")"
sink_good_pid_old="$(cat "${sink_good_pid_file}")"

req_result=$(curl -s -o /dev/null -w "%{http_code}" -XPUT http://localhost:10000/restartspservices)

stream_enrich_pid_new="$(cat "${stream_enrich_pid_file}")"
stream_collector_pid_new="$(cat "${stream_collector_pid_file}")"
sink_bad_pid_new="$(cat "${sink_bad_pid_file}")"
sink_good_pid_new="$(cat "${sink_good_pid_file}")"

if [[ "${req_result}" -eq 200 ]] &&
   [[ "${stream_enrich_pid_old}" -ne "${stream_enrich_pid_new}" ]] &&
   [[ "${stream_collector_pid_old}" -ne "${stream_collector_pid_new}" ]] &&
   [[ "${sink_bad_pid_old}" -ne "${sink_bad_pid_new}" ]] &&
   [[ "${sink_good_pid_old}" -ne "${sink_good_pid_new}" ]]; then

  echo "Restarting SP services is working correctly."
else
  echo "Restarting SP services is not working correctly."
  exit 1
fi


## upload enrichment test
upload_enrichments_result=$(curl -s -o /dev/null -w "%{http_code}"  --header "Content-Type: multipart/form-data" -F "enrichmentjson=@$testEnv/orgEnrichments/enrich.json" localhost:10000/uploadenrichments)
enrichment_diff=$(diff $testEnv/testEnrichments/enrich.json $testEnv/orgEnrichments/enrich.json)
sleep 2

if [[ "${upload_enrichments_result}" -eq 200 ]] && [[ "${enrichment_diff}" == "" ]];then
    echo "Uploading enrichment is working correctly."
else
    echo "Uploading enrichment is not working correctly."
    exit 1
fi

sudo cp $testInit/snowplow_mini_control_plane_api_original_init /etc/init.d/snowplow_mini_control_plane_api
sudo /etc/init.d/snowplow_mini_control_plane_api restart 

exit 0
