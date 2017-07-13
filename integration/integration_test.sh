#!/bin/bash

sudo service elasticsearch start
sudo service iglu_server_0.2.0 start
sudo service snowplow_stream_collector_0.9.0 start
sudo service snowplow_stream_enrich_0.10.0 start
sudo service snowplow_elasticsearch_sink_good_0.8.0 start
sudo service snowplow_elasticsearch_sink_bad_0.8.0 start
sudo service kibana4_init start
sudo service nginx start
sleep 15

# Send good and bad events
COUNTER=0
while [  $COUNTER -lt 10 ]; do
  curl http://localhost:8080/i?e=pv
  curl http://localhost:8080/i
  let COUNTER=COUNTER+1 
done
sleep 5

# Assertions
good_count="$(curl --silent -XGET 'http://localhost:9200/good/good/_count' | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["count"]')"
bad_count="$(curl --silent -XGET 'http://localhost:9200/bad/bad/_count' | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["count"]')"

echo "Event Counts:"
echo " - Good: ${good_count}"
echo " - Bad: ${bad_count}"

control_plane_dir="/home/ubuntu/snowplow/control-plane"
#copy control plane directory to /home/ubuntu/snowplow for testing
cp -r provisioning/resources/control-plane $control_plane_dir
test_dir="$control_plane_dir/test"
$test_dir/test.sh $test_dir
#remove after testing is done
sudo rm -rf $control_plane_dir
control_plane_test_res=$?

# Bad Count is 11 due to bad logging
if [[ "${good_count}" -eq "10" ]] && [[ "${bad_count}" -eq "11" ]] &&
   [[ "${control_plane_test_res}" -eq "0" ]]; then
  exit 0
else
  exit 1
fi
