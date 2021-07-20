module.exports = function(RED) {
    function StromquittungNode(config) {
        RED.nodes.createNode(this,config);
        const axios = require("axios");
        var node = this;
        node.on('input', async function(msg) {
            // Step 1: Build initial request
            // Step 2: Store account (as tentetive)
            // Step 3: Provide Quittung if available (all mandatory fields set)
            if((typeof msg.topic == 'undefined')||(msg.topic == null) || (msg.topic.length <1)) msg.topic = "preperation";
            let url = "https://api.corrently.io/v2.0/quittung/commit";
            let preperation = node.context().get(msg.topic);
            if((typeof preperation !== 'undefined')&&(preperation!==null)&&(preperation.length>0)) {
              msg.payload.preperation = preperation;
              url+="?account="+preperation;
            }
            let apiCall = await axios.post(url,msg.payload);
            let apiResponse = apiCall.data;
            console.log(apiResponse);
            if(typeof apiResponse.err !== 'undefined') {
              node.context().set(msg.topic,apiResponse.account);
            } else {
              node.context().set(msg.topic,"");
              msg.payload = apiResponse;
              node.send(msg);
            }
        });
    }
    RED.nodes.registerType("Stromquittung",StromquittungNode);
}
