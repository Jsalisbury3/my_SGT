const express = require('express');
const webserver = express();
const mysql = require('mysql');
const mysql_creds = require('./config/mysql_creds.js')
const db = mysql.createConnection(mysql_creds);
const axios = require('axios');
var cors = require('cors')
const jwt = require('jwt-simple');
const hash = require('./config/token-hash');
const bodyParser = require('body-parser');
webserver.use(express.static(__dirname + '/client'));
webserver.use(express.urlencoded({extended: false}));
webserver.use(bodyParser.json({limit: '25mb'}));
webserver.use(express.json());
webserver.use(cors());
webserver.post('/api/getAllStudents', (request,response)=>{
    db.connect(()=>{
        const getAllStudentsQuery = "SELECT * FROM `Students`"
        db.query(getAllStudentsQuery, (error,data)=>{
            if(!error){
                const output = {
                    'success': true,
                    'data': data 
                }
                response.send(output)
                
            }else{
                const output = {
                    'success': false,
                    'message': 'query failed'
                }
                response.send(output)
            }
        })
    })
});

webserver.post('/api/deleteStudent', (request,response)=>{
    const frontID = request.body.id
            const deleteStudentsQuery = "DELETE FROM `Students` where ID = '"+frontID+"'"
            db.query(deleteStudentsQuery, (error,data)=>{
                if(!error){
                    const output = {
                        'success': true,
                    }
                    response.send(output)
                }else{
                    const output = {
                        'success': false,
                        'message': 'query failed'
                    }
                    response.send(output)
                }
            })
});

webserver.post('/api/addStudent', (request,response)=>{
    const name = request.body.name
    console.log(name)
    const grade = request.body.grade
    const course = request.body.course
    db.connect(()=>{
            const addStudentsQuery = "INSERT INTO `Students` SET `Name` = '"+name+"', Grade = '"+grade+"', Course = '"+course+"'";
            db.query(addStudentsQuery, (error,data)=>{
                if(!error){
                            const output = {
                                'success': true,
                                'data': data,
                            }
                            response.send(output)
                } else {
                    failedQueryModal();
                    const output = {
                        'success': "false",
                        'message' : "first query didnt work"
                    }
                    response.send(output);
                }
            })
    })
    
});

webserver.post("/api/UpdateStudent", (request, response) => {
    const name = request.body.name;
    const course = request.body.course;
    const grade = request.body.grade;
    const id = request.body.id;
    const valuesArray = [name, course, grade, id];
    db.connect(() => {
        const query = "UPDATE `Students`" +
                      " SET Name = ?, Course = ?, Grade = ?" +
                      " WHERE ID = ?";
        const UpdateQuery = mysql.format(query, valuesArray);
        console.log(UpdateQuery);
        db.query(UpdateQuery, (err, data) => {
            if(!err) {
                const output = {
                    success: true
                };
                response.send(output)
            } else {
                const output = {
                    success: false
                };
                response.send(output)
            }
        })
    })
})

webserver.post("/api/LogIn", (request, response) => {
    const email = request.body.Email;
    const password = request.body.Password;
    db.connect(() => {
        const query = "SELECT ID FROM `accounts`" +
                      " WHERE Email = ? AND Password = ?";
        const paramsArr = [email, password];
        const SignInQuery = mysql.format(query, paramsArr);
        db.query(SignInQuery, (err, UserId) => {
            if(!err) {
                if(UserId > 1) {
                    const output = {
                        success: false,
                        message: "unable to log you in"
                    }
                    
                    response.send(output);
                } else {
                    if(UserId.length > 0) {
                        const token = jwt.encode(email + password, hash);
                        console.log("token: ", token);
                        const output = {
                            success: true,
                            token: token
                        };
                      
                        response.send(output)
                    } else {
                        const output = {
                            success: false,
                            message: "Invalid username/password"
                        };
                       
                        response.send(output);
                    }
                }
            } else {
                const output = {
                    success: false,
                    message: "error logging you in"
                }
           
                response.send(output);
            }
        })
    })
});

webserver.post("/api/SignUp", (request, response) => {
    const email = request.body.Email;
    const password = request.body.Password;
    db.connect(() => {
        const query = "SELECT ID FROM `accounts`" +
            " WHERE Email = ? AND Password = ?";
        const paramsArr = [email, password];
        const CheckRecordsQuery = mysql.format(query, paramsArr);
        db.query(CheckRecordsQuery, (err, data) => {
            if(!err && data.length < 1) {
                const token = jwt.encode(email + password, hash);
                let query = "INSERT INTO `accounts`" +
                    " SET Email = ?, Password = ?, token = ?";
                let valuesArr = [email, password, token];
                const InsertQuery = mysql.format(query, valuesArr);
                console.log(InsertQuery);
                db.query(InsertQuery, (err, data) => {
                    if(!err) {
                        const output = {
                            success: true,
                            token: token
                        };
                      
                        response.send(output);
                    } else {
                        const output = {
                            success: false,
                            message: "unable to make new account"
                        };
                     
                        response.send(output);
                    }
                })
            } else {
                const output = {
                    success: false,
                    message: "Email/Password has already been taken",
                }
               
                response.send(output);
            }
        })
    })
})

webserver.listen(7000, () => {
   console.log("listening on port 7000");
});

function failedQueryModal(){
    var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true' data-backdrop='static' data-keyboard='false'>");
    var modalDialog = $("<div class='modal-dialog' role='document'>");
    var modalContent = $("<div>").addClass("modal-content");
    var modalHeader = $("<div>").addClass("modal-header");
    var modalTitle = $("<div>").addClass("modal-title").text("Error");

    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);

    var modalFooter = $("<div>").addClass("modal-footer");
    var cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelDeleteButton.text("Cancel");
    modalFooter.append(cancelDeleteButton);
    modalContent.append(modalFooter);
    modalDialog.append(modalContent);
    modalFade.append(modalDialog);
    $(modalFade).modal("show");
    $(modalFade).on('hidden.bs.modal', () => {
        $(modalFade).remove();
    });

}
