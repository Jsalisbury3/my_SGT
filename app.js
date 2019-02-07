const express = require('express');
const webserver = express();
const mysql = require('mysql');
const mysql_creds = require('./config/mysql_creds.js')
const db = mysql.createConnection(mysql_creds);
const axios = require('axios');
var cors = require('cors')
const bodyParser = require('body-parser');
webserver.use(express.static(__dirname + '/client'));
webserver.use(express.urlencoded({extended: false}));
webserver.use(bodyParser.json({limit: '25mb'}));
webserver.use(express.json());
webserver.use(cors());
webserver.post('/api/getAllStudents', (request,response)=>{
    db.connect(()=>{
        const getAllStudentsQuery = "SELECT * FROM `Students` JOIN `Course` ON Students.ID = Course.Student_ID"
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
    db.connect(()=>{
            const deleteStudentsQuery = "DELETE * FROM `Students` JOIN `Course` ON Students.ID = Course.Student_ID"
            // DELETE FROM STUDENTS WHERE ID = student id (thats passed in)
            db.query(deleteStudentsQuery, (error,data)=>{
                const deleteStudentsQuery2 = ""
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
        })
});




webserver.post('/api/addStudent', (request,response)=>{
    const name = request.body.name
    console.log(name)
    const grade = request.body.grade
    const course = request.body.course
     db.connect(()=>{
            const addStudentsQuery = "INSERT INTO `Students` SET `Name` = '"+name+"'";
            console.log("query: ", addStudentsQuery);
            db.query(addStudentsQuery, (error,data)=>{
                const newID =  data.insertId 
                const addStudentQuery2 = 'INSERT INTO `Course` SET `Student_ID` = "'+newID+'", Grade = "'+grade+'", Course = "'+course+'"';
                // `Student_ID` = "'+newID+'",
                // `INSERT INTO `Course` SET Grade = '"+grade+"', Course = '"+course+"' `;
                console.log(addStudentQuery2);
                if(!error){
                    db.query(addStudentQuery2,(error,data)=>{
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
                } else {
                    const output = {
                        'success': "false",
                        'message' : "first query didnt work"
                    }
                    response.send(output);
                }
            })
    })
    
});

    // db.connect(()=>{
    //     const getAllStudentsQuery = "DELETE * FROM `Students` JOIN `Course` ON Students.ID = Course.Student_ID"
    //     db.query(getAllStudentsQuery, (error,data)=>{
    //         if(!error){
    //             const output = {
    //                 'success': true,
    //                 'data': data 
    //             }
    //             response.send(output)
                
    //         }else{
    //             const output = {
    //                 'success': false,
    //                 'message': 'query failed'
    //             }
    //             response.send(output)
    //         }
    //     })
    // })
    // db.connect(()=>{
    //     const getAllStudentsQuery = "ADD * FROM `Students` JOIN `Course` ON Students.ID = Course.Student_ID"
    //     db.query(getAllStudentsQuery, (error,data)=>{
    //         if(!error){
    //             const output = {
    //                 'success': true,
    //                 'data': data 
    //             }
    //             response.send(output)
                
    //         }else{
    //             const output = {
    //                 'success': false,
    //                 'message': 'query failed'
    //             }
    //             response.send(output)
    //         }
    //     })
    // })
    
    /// Delete * from students join course On students.ID = course.student_id
    // no object success true
    




















// webserver.get('*', (request, response) => {
//     console.log(request);
//    response.sendFile(__dirname + '/index.html');
// });
webserver.listen(7000, () => {
   console.log("listening on port 7000");
});