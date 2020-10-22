const modal_form = document.getElementById('modal_form'), 
    recipient_name = document.getElementById('recipient-name'),
    message_text = document.getElementById('message-text'),
    edit_put = document.getElementById('edit-put');
   

let currentPost;
let currentPost_de;
let count = 0;
//const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');
const request = new XMLHttpRequest();

const sendHttpRequest = (method, url, data) => {  //fetch的上半部整理成function
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {} //{}裡面可放物件//三元表達式
    })  //get data  
        .then(response => {
            if (response.status >= 400) {       //參考xml httprequest對於錯誤的處理方法
                //!response.ok
                return response.json().then(errResData => {
                    const error = new Error('Something went wrong!');
                    error.data = errResData;   //找出錯誤的資料為何
                    throw error;
                });
            }
            return response.json();
        })
}

//------get template-------
const content_tpl = tpl => {
    return ` 
    <div class="media main_BCC">
        <figure class="figure_range">
            <img src="assets/img/blog/匿名頭像1.jpg" class="align-self-start mr-3" alt="...">
            <figcaption>${tpl.fName}</figcaption>
        </figure>
        <div class="media-body">
            <div class="icon_right">
                <h5 class="mt-0" id="title">標題 : ${tpl.fTitle}</h5>
                <div id="btn_container" data-id="${tpl.fID}">
                    <a href="localhost:44310/api/API/${tpl.fID}" id="edit${tpl.fID}" onclick="getData_edit(${tpl.fID})" data-toggle="modal" data-target="#editMessage">
                        <i class="fas fa-edit button_margin" style="color:gray" data-target="#editMessage"></i>
                    </a>
                    <a href="localhost:44310/api/API/${tpl.fID}" id="delete${tpl.fID}" data-id ="" onclick="getData_delete(${tpl.fID})" data-toggle="modal">
                        <i class="fas fa-trash button_margin" style="color:gray"></i>
                    </a> 
                    </div>
                
            </div>
               
    
            <p>第${tpl.fID}篇  文章類型 : ${tpl.fType}</p>             
            <p></p>
            <p id="content">${tpl.fContent}</p>
            <img src="assets/img/service/services3.jpg" class="align-self-start mr-3" style="width:330px;length:290px" alt="...">
            <img src="assets/img/service/services4.jpg" class="align-self-start mr-3" style="width:330px;length:290px" alt="...">
            <img src="assets/img/service/services5.jpg" class="align-self-start mr-3" style="width:330px;length:290px" alt="...">
            <p>發文時間 : ${tpl.fdate}</p>
            <div class="input-group ">
                <div class="input-group-prepend">
                        <div class="input-group-text">留言</div>
                </div>
                <input type="text" class="form-control text_mragin" id="post-Message${tpl.fID}" name="${tpl.fID}"  
                placeholder="留言......">
            </div>
            <div class="push_right">
                <button type="submit" class="btn btn-secondary button_margin"  id="post-Mbtn${tpl.fID}" onclick="sendMessageData(${tpl.fID})">留言</button>               
            </div>            
            <P></P> 
            
            ${tpl.message.fmessage.map(o =>
        `           
            <div class="response_range">
                <figure>
                    <img src="assets/img/blog/頭像2.jpg" class="align-self-start mr-3" alt="...">
                    <figcaption>${o.fMName}</figcaption>
                </figure>
                <div>
                    <p>${o.fMContent}</p>
                    <p>o.fMesTime</p>
                </div>
                
            </div> 
            `
    ).join(" ")} 
            </div>           
        </div>
        <P></P>
    </div>
    ` ;
};

//無法用forEach?



//=============get data===============
const getData = () => {
    sendHttpRequest('get', 'https://localhost:44310/api/API')
        .then(responseData => {
            let str = '';
            responseData.ftable.forEach(i => {               
                count=i.count;
                str += content_tpl(i);                                             
            })
            $('#tpl').html(str);
            //console.log(responseData);
            // const postMessageBtn = document.getElementById('post-Mbtn');
            // postMessageBtn.addEventListener('click', sendMessageData);
        })
};

//==============delete data==============
const getData_delete = (fid) => {
    confirm("確定要刪除嗎?");
    // currentPost.iID
    console.log('fid:',fid);
    let UrlPutID = `https://localhost:44310/api/API/?id=${fid}`
    sendHttpRequest('delete', UrlPutID, {
        "delete":"delete"
    }).then(responseData => {
        console.log(responseData);
        //console.log(typeof responseData);
        //console.log(tpl.fID);
        //console.log(message.fmessage);
        request.onload = getData();
    }).catch(err => {
        console.log(err, err.data);
    });

};




//server自動取出資料
request.onload = getData();
//=============get edit============
const getData_edit = (fid) => {
    let UrlGetID = `https://localhost:44310/api/API/${fid}`
    sendHttpRequest('get', UrlGetID)
        .then(responseData => {
            // console.log('responseData:', responseData);
            responseData.ftable.forEach(i => {
                
                currentPost = i;
                console.log({currentPost});
                modal_form.setAttribute('data-id', i.fID);
                document.getElementById('recipient-name').value = i.fTitle;
                document.getElementById('message-text').value = i.fContent;
                document.getElementById('edit-put').data = i.fID;
            })
           
            // $('#tpl').html(str);
            // //console.log(responseData);
            // const postMessageBtn = document.getElementById('post-Mbtn');
            // postMessageBtn.addEventListener('click', sendMessageData);
        })
};
//server自動取出資料
//request.onload = getData_edit();
//request.onload = getData();


//============put edit==========
const putEditData = () => {
    // currentPost.iID
    console.log('fid:', currentPost.fID);
    let UrlPutID = `https://localhost:44310/api/API/?id=${currentPost.fID}`
    sendHttpRequest('Put', UrlPutID, {
        "title": document.getElementById('recipient-name').value,
        "content": document.getElementById('message-text').value
    }).then(responseData => {
        console.log(document.getElementById('message-text').value);
        console.log(responseData);
        //console.log(typeof responseData);
        //console.log(tpl.fID);
        //console.log(message.fmessage);
        request.onload = getData();
    }).catch(err => {
        console.log(err, err.data);
    });

};


//=======================send Data=========================
const sendData = () => {
    if (!document.getElementById("get-title").value) {
        alert('請填入標題!');
    }
    else if (!document.getElementById("get-content").value) {
        alert('請填入內容!');
    }
    else {
        sendHttpRequest('post', 'https://localhost:44310/api/API', {
            "title": document.getElementById("get-title").value,  //data的格式取決於要post出去的項目格式
            "content": document.getElementById("get-content").value,
            //"pic1": XXX
        }).then(responseData => {
            console.log(responseData);
            console.log(typeof responseData);
            //再次從server取資料
            request.onload = getData();
        }).catch(err => {
            console.log(err, err.data);
        });
    }
};



//==================TODO==================字串裡塞變數????    後端需加接message的程式碼
//post message data
const sendMessageData = (fid) => {
    let content = `post-Message${fid}`
    let UrlPutMessageID = `https://localhost:44310/api/MessageAPI/?id=${fid}`
    if(!document.getElementById(content).value){
        alert("請輸入留言!");
        return
    }
    sendHttpRequest('post',UrlPutMessageID, {        
        "forumType": 4,
        "ForumID": fid,
        "content": document.getElementById(content).value
    }).then(responseData => {
        console.log(responseData);
        //console.log(typeof responseData);
        console.log(tpl.fID);
        request.onload = getData();
    }).catch(err => {
        console.log(err, err.data);
    });

};



//getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);
postBtn.addEventListener('click', getData);



//getEditBtn.addEventListener('click', getData_edit(fid));
// function getValue() {
//     var content = document.getElementById("get-content").value;
//     console.log(content);
//}