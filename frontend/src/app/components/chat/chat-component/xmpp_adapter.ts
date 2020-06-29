import { ChatAdapter, User, Message, UserStatus } from 'ng-chat';
import {Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BoshClient, $build, XmlElement} from "xmpp-bosh-client/browser";

export class XMPPAdapter extends ChatAdapter {

    // The id generated to the user that has just connected
    public userId: any; 

    //Friend List
    private friends : User[] = [];

    private conn;
    private uniqueIdCount = 1;
    private initialMessage = "Bienvenido a nuestro chat";

    constructor(user: string, pass:string, url:string) {
        super();
        this.userId = user;
        //console.log(" "+user+" "+pass+" "+url);
        this.conn = new BoshClient(user, pass, url);

        this.initializeErrorListener();
        this.initializePingListener();
        this.initializeOnlineListener();
        this.initializeOfflineListener();
        this.initializeStanzaListener();

        this.conn.connect();
    }

    /* begin Listener*/

    initializeErrorListener(){
        this.conn.on("error", (e) => {
            console.log("Error event");
            console.log(e); 
        });
    }

    initializePingListener(){
        /*this.conn.on("ping", () => {
            console.log(`Ping received at ${new Date()}`);
        });*/
    }

    initializeOnlineListener(){
        this.conn.on("online", () => {
            console.log("Connected successfully");
            this.requestRoster();
            this.presenceMessage(this.userId);
                     
        });
    }

    initializeOfflineListener(){
        this.conn.on("offline", () => {
            console.log("Disconnected/Offline");
            this.presenceOffMessage(this.userId);
        });
    }

    initializeStanzaListener(){
        this.conn.on("stanza", (stanza) => {            
            if(stanza.name == "iq" && stanza.attrs){
                /* if roster */
                if(stanza.attrs.id.indexOf("rosterId_")>=0){
                    this.receiveRosterMessage(stanza);              
                }                 
            }
            else if(stanza.name == "message"){
                /* if receive message */
                this.receiveMessage(stanza);
            }
            else if(stanza.name == "presence"){
                this.receivePresence(stanza);
            }
            
            /*else if(ch.attrs && ch.attrs.xmlns == "urn:xmpp:mam:0"){
                for(let u of ch.children){
                    console.log(u)
                }
            }*/
            console.log(`Stanza received at ${new Date()}`);
            console.log(stanza);
        });
    }
    /* end Listener*/

    /*begin virtual methods*/
    listFriends(): Observable<User[]> {
        return Observable.of(this.friends);
    }

    getMessageHistory(userId: any): Observable<Message[]> {
        //this.requestMessageHistory(userId);
        let mockedHistory: Array<Message>;      
        mockedHistory = [
            {
                fromId: userId,
                toId: this.userId,
                message: this.initialMessage
            }
        ];
        //mockedHistory = [];
        return Observable.of(mockedHistory);
    }

    sendMessage(msg: Message): void {
        const message: XmlElement = $build('message', { to: msg.toId, from: msg.fromId, type: "chat"});
        const body = message.cnode($build("body", {
        }));
        body.t(msg.message);  
        this.conn.send(message);

        // falta utilizar el observable de visto el mensaje. 
    }
    /*end virtual methods*/

    /* begin protocols methods*/
    receivePresence(stanza){
        if(stanza.attrs && stanza.attrs.from && stanza.attrs.from.split("/")[0] != this.userId){
            let uId = stanza.attrs.from.split("/")[0];
            for(let user of this.friends){
                if(user.id == uId){
                    if(!stanza.attrs.type){
                        user.status = UserStatus.Online;
                        console.log("Usuario: "+user.displayName + "is online");
                    }
                    else if(stanza.attrs.type == "unavailable"){
                        user.status = UserStatus.Offline;
                        console.log("Usuario: "+user.displayName + "is offline");
                    }
                }
            }
        }
    }

    receiveMessage(stanza){
        for(let ch of stanza.children){
            if(ch.name == "body" && ch.children && ch.children.length>0){
                console.log(ch.children[0]);
                
                let user = new User();
                let message = new Message();

                user.id = stanza.attrs.from.split("/")[0];
                user.displayName = user.id.split("@")[0];
                //hay que ver como actualizar este parametro
                user.status = UserStatus.Online;

                message.fromId = user.id;
                message.message = ch.children[0];
                message.toId = this.userId;
                
                super.onMessageReceived(user, message);
            }
        }
    }

    receiveRosterMessage(stanza){
        for(let ch of stanza.children){
            if(ch.attrs && ch.attrs.xmlns == "jabber:iq:roster"){
                 for(let u of ch.children){
                    let user = new User();
                    user.id = u.attrs.jid;
                   // console.log(u.attrs.jid);
                    if(u.attrs.name){
                        user.displayName = u.attrs.name.split("@")[0];
                    }
                    else{
                        user.displayName = u.attrs.jid.split("@")[0];
                    }
                   // console.log(u.attrs.name);  
                    user.status = UserStatus.Offline;
                    this.friends.push(user);
                 }
            }
        }
    }

    requestRoster(){
        const roster: XmlElement = $build('iq', { from: this.userId, type: "get", id: "rosterId_"+this.uniqueIdCount});
        const query = roster.cnode($build("query",{xmlns: 'jabber:iq:roster'}));  
        console.log("Roster "+roster);       
        this.conn.send(roster);
        this.uniqueIdCount++;
    }
    
    requestMessageHistory(JID:any){       
        const messageHistory: XmlElement = $build('iq', {type: "set", id: "historyId_"+this.uniqueIdCount});
        const query = messageHistory.cnode($build("query",{xmlns: 'urn:xmpp:mam:0'})); 

        const x = query.cnode($build("x",{xmlns: 'jabber:x:data',type:'submit'})); 

        const field1 = x.cnode($build("field",{var: 'FORM_TYPE',type:'hidden'}));         
        const value1 = field1.cnode($build("value",{}));
        value1.t('urn:xmpp:mam:0');

        const field2 = x.cnode($build("field",{var: 'with'}));
        const value2 = field2.cnode($build("value",{}));
        value2.t(JID);

        console.log("History: "+messageHistory);
        this.conn.send(messageHistory);
        this.uniqueIdCount++;
    }

    presenceMessage(userId:any){
        const presence: XmlElement = $build('presence', {from: userId});
        const priority = presence.cnode($build("priority",{}));

        priority.t("1");

        console.log("Presence: "+presence);
        this.conn.send(presence);
    }

    presenceOffMessage(userId:any){
        const presence: XmlElement = $build('presence', {from: userId, type: "unavailable"});
        const priority = presence.cnode($build("priority",{}));

        priority.t("1");

        console.log("Presence: "+presence);
        this.conn.send(presence);
    }
    /*end protocols methods*/  
}