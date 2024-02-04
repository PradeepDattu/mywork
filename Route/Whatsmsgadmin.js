


function Whatsmsgadmin(formType,payload,mobile){
    // console.log("cheking");
if(mobile.length!=10){return};
// console.log("working");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("authkey", "414824AYgyh4tgl5ZR65b75ce6P1");
    switch(formType){

         case "appointment_form_admin": var extraString={
                      "type": "body", 
                      "parameters": [
                          {
                              "type": "text",
                              "text": payload.fname+' '+payload.lname?payload.lname:' '
                          },
                          {
                            "type": "text",
                            "text": payload.phone
                        },
                        {
                            "type": "text",
                            "text": payload.email?payload.email:' - '
                        },
                        {
                            "type": "text",
                            "text": payload.appointmentDate?payload.appointmentDate:'Any Date'
                        },
                        {
                            "type": "text",
                            "text": payload.appointmentTime?payload.appointmentTime:'Any Time'
                        },
                        {
                            "type": "text",
                            "text": payload.city?payload.city:' - '
                        },
                        {
                            "type": "text",
                            "text": payload.message?payload.message.replace(/[\s\t\n]+/g, '_'):' - '
                        }
                      ]
                  };break;
        case "astro_form_admin":var extraString={
            "type": "body", 
            "parameters": [
                {
                    "type": "text",
                    "text": payload.fname+' '+payload.lname?payload.lname:' '
                },
                {
                  "type": "text",
                  "text": payload.phone
              },
              {
                  "type": "text",
                  "text": payload.email?payload.email:' - '
              },
              {
                  "type": "text",
                  "text": payload.DOB?payload.DOB:' - '
              },
              {
                  "type": "text",
                  "text": payload.TOB?payload.TOB:' - '
              },
              {
                  "type": "text",
                  "text": payload.nakshatra?payload.nakshatra:' - '
              },
              {
                  "type": "text",
                  "text": payload.POB?payload.POB:' - '
              },
              {
                "type": "text",
                "text": payload.city?payload.city:' - '
            },
            {
                "type": "text",
                "text": payload.address?payload.address.replace(/[\s\t\n]+/g, '_'):' - '
            },
            {
                "type": "text",
                "text": payload.message?payload.message.replace(/[\s\t\n]+/g, '_'):' - '
            }
            ]
        };break;
        case "event_form_admin":var extraString={            
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": payload.fname+' '+payload.lname?payload.lname:' '
                    },
                    {
                      "type": "text",
                      "text": payload.phone
                  },
                  {
                      "type": "text",
                      "text": payload.email?payload.email:' - '
                  },
                  {
                      "type": "text",
                      "text": payload.eventName?payload.eventName:' - '
                  },
                  {
                      "type": "text",
                      "text": payload.eventDate?payload.eventDate:' - '
                  },
                  {
                      "type": "text",
                      "text": payload.eventTime?payload.eventTime:' - '
                  },
                  {
                      "type": "text",
                      "text": payload.city?payload.city:' - '
                  },
                  {
                    "type": "text",
                    "text": payload.address?payload.address.replace(/[\s\t\n]+/g, '_'):' - '
                },
                {
                    "type": "text",
                    "text": payload.message?payload.message.replace(/[\s\t\n]+/g, '_'):' - '
                }
            ]
        };break;          
    }
    var raw = JSON.stringify({
      "integrated_number": "918328500265",
      "content_type": "template",
      "payload": {
          "to": "91"+mobile,
          "type": "template",
          "template": {
              "name": formType,
              "language": {
                  "code": "en",
                  "policy": "deterministic"
              },
              "components": [
                  
                  extraString
              ]
          },
          "messaging_product": "whatsapp"
      }
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",requestOptions)
    .then(response => response.text())
    .catch(error => console.log('error', error));
    

    
}

module.exports={Whatsmsgadmin};