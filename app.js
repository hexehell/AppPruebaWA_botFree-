const fs = require('fs');
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const  main = async ()=>{

 
 
    // let servidor = require('express');


    
    let client;

    client = new Client({
        authStrategy: new LocalAuth({ clientId: "client-one",dataPath:"." })
   });

    
    //
    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        // console.log('QR RECEIVED', qr);
        // qrcode.generate(qr,{small:true,});
    
        
    });
    
    client.on('ready', () => {
        console.log('Cliente listo');
    });
    
    client.on('message', msg => {

        const { from,to, body, hasMedia,timestamp } = msg;

        if (from === 'status@broadcast') {
            return
        }

        console.log(`Fecha: ${new Date().toDateString() }`)
        console.log(`De: ${fnLimpiarNumero(from)} Para: ${fnLimpiarNumero(from)}\n ${msg.body}`  );



        if(msg.hasMedia){
          msg.downloadMedia().then((media) =>{


            fs.writeFile(`./media/${fnLimpiarNumero(from)+Date.now()}.jpg`, media.data, { encoding: 'base64' }, function (err) {
                console.log('** Archivo Media Guardado **');
            });

          });
        }
        
        



    
        // console.log(media)
    });
    
    client.on('auth_failure', (e) => {
         console.log(e)
    
           
            
        // connectionLost()
    });
    
    client.on('authenticated', (session) => {
        sessionData = session;
        if(sessionData){
            fs.writeFile('keyQR', JSON.stringify(session), function (err) {
                if (err) {
                    console.log(`Ocurrio un error con el archivo: `, err);
                }
            });
        }
    });
    

    // servidor.listen(3032,()=>{

    //     console.log('escuchando por el puerto 3032')
    // })

    client.initialize();


}


const fnLimpiarNumero = (number) => {
    number = number.replace('@c.us', '');
    // number = `${number}@c.us`;
    return number
}

main().catch(console.log);


