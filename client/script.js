$(document).ready(initializeApp);

var studentArray = [];

function initializeApp(){
      $('.btn-success').click(handleAddClicked);
      $('.btn-primary').click(handleCancelClick);
      $('#studentGrade').on("change", gradeValidation);
      $('#studentName').on("change", nameValidation);
      checkAuth();
      $(".fa-spin").hide()
}

function checkAuth() {
    if(localStorage.getItem("token")) {
        loadData();
    } else {
        if(window.location.pathname == "/") {
            location.replace("/signIn.html");
        }
    }
}

function signOut(){
     localStorage.clear();
     location.replace("/signIn.html") 
}

function handleAddClicked(){
    addStudent();
}

function handleCancelClick(){
    clearAddStudentFormInputs()
}

function addStudent(){
    var studentName = $('#studentName').val();
    var studentCourse = $('#course').val();
    var studentGrade = $('#studentGrade').val();
    if(($("#nameDiv").hasClass("has-error") && $("#gradeDiv").hasClass("has-error"))){
        return;
    }
    if(($("#nameDiv").hasClass("has-error") || $("#gradeDiv").hasClass("has-error"))){
        return;
    }
    if(($("#editNameDiv").hasClass("has-error") && $("#editGradeDiv").hasClass("has-error"))){
        return;
    }
    if(($("#editNameDiv").hasClass("has-error") || $("#editGradeDiv").hasClass("has-error"))){
        return;
    }

    if(studentName ==='' || studentCourse ===''|| parseFloat(studentGrade<=0) || parseFloat(studentCourse> 100) || isNaN(studentGrade)){
        return;
    }   
        $(".fa-spin").show()
        sendNewStudentData(studentName, studentGrade, studentCourse) 
}

function clearAddStudentFormInputs(){
    $('input[name=studentName]').val('').blur();
    $('input[name=course]').val('').blur();
    $('input[name=studentGrade]').val('').blur();
    $("#gradeDiv").removeClass('has-success');
    $("#gradeDiv").removeClass('has-error');
    $("#nameDiv").removeClass('has-success');
    $("#nameDiv").removeClass('has-error');
    $(".invalid-feedback").remove();
}


function invalidModal() {
    var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true' data-backdrop='static' data-keyboard='false'>");
    var modalDialog = $("<div class='modal-dialog' role='document'>");
    var modalContent = $("<div>").addClass("modal-content");
    var modalHeader = $("<div>").addClass("modal-header");
    var modalTitle = $("<div>").addClass("modal-title").text("Invalid Input");

    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);

    var modalFooter = $("<div>").addClass("modal-footer");
    var cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelDeleteButton.text("Confirm");
    modalFooter.append(cancelDeleteButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    $(modalFade).on('hidden.bs.modal', () => {
        $(modalFade).remove();
    });
}

function renderStudentOnDom(studentObj){
    var nameTableData = $('<td>',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Name,
        'text-align': 'center'
    });

    var gradeTableData = $('<td>',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Grade,
        'text-align': 'center'
    });

    var courseTableData = $('<td>,',{
        class: 'col-xs-3 col-sm-3',
        text: studentObj.Course,
        'text-align': 'center',
    })

    var deleteButton = $('<button>',{
        class: 'btn btn-danger btn-sm glyphicon glyphicon-trash',
        'text-align': 'center',
        on: {
            click: deleteModal
        }
    })

    var editButton = $('<button>',{
        class: 'btn btn-warning btn-sm glyphicon glyphicon-edit edit',
        id:'edits',
        'text-align': 'center',
        rowNum: studentObj.ID,
        on: {
            click: handleEditModal
        }
    })

 

        function handleEditClicked(studentObj){
            changeToInputFields(studentObj);
        }
        function handleEditModal(studentObj){
            editModal(studentObj)
        }

        function handleDeleteClicked(){
            $(".fa-spin").show()
            deleteStudentData(studentObj.ID);
        }


        function deleteStudentData(student_id){
            try{
            var ajaxDelete = {
                dataType: 'json',
                url: "/api/deleteStudent",
                method: 'post',
                data: {
                    id: student_id
                },
                error: handleError
            }
        
            $.ajax(ajaxDelete).then(function(response){
                var studentIndex = studentArray.indexOf(studentObj);
                studentArray.splice(studentIndex, 1);
                newTableRow.remove();
                calculateGradeAverage(studentArray);
                $(".fa-spin").hide()
            });
        
            }catch(error){
                handleError(error)
                $(".fa-spin").hide()
            }
        
        
        }

        var buttonTd = $('<td>').append(deleteButton, editButton);
        var newTableRow = $('<tr>').append(nameTableData, courseTableData, gradeTableData, buttonTd);
        $('tbody').append(newTableRow);


        function deleteModal() {
        var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true' data-backdrop='static' data-keyboard='false'>");
        var modalDialog = $("<div class='modal-dialog' role='document'>");
        var modalContent = $("<div>").addClass("modal-content");
        var modalHeader = $("<div>").addClass("modal-header");
        var modalTitle = $("<div>").addClass("modal-title").text("Are you sure you want to remove this student?");
    
        modalHeader.append(modalTitle);
        modalContent.append(modalHeader);
    
    
        var modalFooter = $("<div>").addClass("modal-footer");
        var cancelDeleteButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
        cancelDeleteButton.text("Cancel");
        var confirmDeleteButton = $("<button class='btn btn-danger' data-dismiss='modal'>");
    
        confirmDeleteButton.on("click", () => {
                handleDeleteClicked();
        });
        confirmDeleteButton.text("DELETE");
        modalFooter.append(cancelDeleteButton);
        modalFooter.append(confirmDeleteButton);
        modalContent.append(modalFooter);
    
        modalDialog.append(modalContent);
        modalFade.append(modalDialog);
    
        $(modalFade).modal("show");
        $(modalFade).on('hidden.bs.modal', () => {
            $(modalFade).remove();
        });
        }

  function editModal() {
    $('.modal-grade-regex').hide()
    var modalFade = $("<div class='modal fade' id='editStudentModal' tabindex='-1' role='dialog' aria-labelledby='editStudentModalLabel' aria-hidden='true'  data-backdrop='static' data-keyboard='false'>");
    var modalDialog = $("<div class='modal-dialog' role='document'>");
    var modalContent = $("<div>").addClass("modal-content");
    var modalHeader = $("<div>").addClass("modal-header");
    var modalTitle = $("<div>").addClass("modal-title").text("Edit Student");

    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);


    var modalBody = $("<form>").addClass("modal-body");
    var modalEditNameDiv = $("<div id='editNameDiv' class='form-group'>");
    var modalEditNameLabel = $("<label for='store_name' class='form-control-label'>").text("Student Name");
    var modalEditName = $("<input id='editStudentName' type='text' class='form-control' onChange='nameValidation()'>");
    modalEditName.val(studentObj.Name);
    modalEditNameDiv.append(modalEditNameLabel);
    modalEditNameDiv.append(modalEditName);

    var modalEditCourseDiv = $("<div class='form-group'>");
    var modalEditCourseLabel = $("<label for='category' class='form-control-label'>").text("Course");
    var modalEditCourse = $("<input type='text' id='editCourse' class='form-control'>");
    modalEditCourse.val(studentObj.Course);
    modalEditCourseDiv.append(modalEditCourseLabel);
    modalEditCourseDiv.append(modalEditCourse);

    var modalEditGradeDiv = $("<div class='form-group' id='editGradeDiv'>");
    var modalEditGradeLabel = $("<label for='amount' class='form-control-label'>").text("Grade");
    var modalEditGrade = $("<input id='editGrade' type='text' class='form-control' onChange='gradeValidation()'>")
    modalEditGrade.val(studentObj.Grade);
    var modalGradeRexex = $("p").text("Invalid Grade").addClass('modal-grade-regex')
    modalEditGradeDiv.append(modalEditGradeLabel);
    modalEditGradeDiv.append(modalEditGrade);
    modalEditGradeDiv.append(modalGradeRexex);


    modalBody.append(modalEditNameDiv);
    modalBody.append(modalEditGradeDiv);
    modalBody.append(modalEditCourseDiv);
    modalContent.append(modalBody);

    let modalFooter = $("<div>").addClass("modal-footer");
    let cancelEditButton = $("<button class='btn btn-secondary' data-dismiss='modal'>");
    cancelEditButton.text("Cancel");
    let confirmEditButton = $("<button  class='btn btn-primary' data-dismiss='modal'>");
    confirmEditButton.on("click", () => {
            /// validation for edit modal
          if(modalEditName.val() ==='' ||  modalEditCourse.val() ===''|| parseFloat( modalEditGrade.val()<=0) || parseFloat(modalEditCourse.val()> 100) || isNaN( modalEditGrade.val())){
            $('.modal-grade-regex').show()
            return;
        }else{
                CalleditStudentList(studentObj);
        }
    });
    confirmEditButton.text("Confirm Edit");
    modalFooter.append(cancelEditButton);
    modalFooter.append(confirmEditButton);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modalFade.append(modalDialog);

    $(modalFade).modal("show");
    $(modalFade).on('hidden.bs.modal', () => {
        $(modalFade).remove();
    });

    function CalleditStudentList(studentObj) {
        const name = modalEditName.val()
        const course =  modalEditCourse.val()
        const grade = modalEditGrade.val();
        const id = studentObj.ID
        calculateGradeAverage(studentArray);
        editStudentList(name, course, grade, id);
    }
    
    function editStudentList(name, course, grade, id){
        $(".fa-spin").show()
        try{
            var ajaxEdit = {
                dataType: 'json',
                method: "POST",
                url: "/api/UpdateStudent",
                data: {
                        name,
                        course,
                        grade,
                        id
                    },
                error: handleError
            }
            $.ajax(ajaxEdit).then(function(response){
                 loadData();
            })
   
        }catch(error){
            handleError(error)
        }
    }

    }


}

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

function validation(){
    const tests = [
        {
            element: "input[name=email]",
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            message: 'must be a valid email address'
        },

        {
            element: "input[name=password]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital and a number'
        },
    ];

    if( tests.length === tests.filter( validateInputAndDisplayError).length){
        logUserIn();
    }
}

function validateInputAndDisplayError( incomingTests ){
    const element = incomingTests.element, pattern = incomingTests.pattern, errorMessage = incomingTests.message;
    const value = $( element ).val();
    const result = pattern.test( value );
    if( !result ){
        $( element ).next().text( errorMessage ).css("color", "red");
    } else {
        $( element ).next().text('');
    }
    return result;
}

function logUserIn() {
    const Email = $('input[name=email]').val();
    const Password = $('input[name=password]').val();
    $.ajax({
        method: "POST",
        url: "/api/LogIn",
        data: {
            Email,
            Password
        }
    }).then((response) => {
        if(response.success) {
            localStorage.setItem("token", response.token);
            location.replace("/");
        } else {
            $('.errorMessage').css("display", "block").css("color", "red").text(response.message);
        }
    })
}

function updateStudentList(updatingStudentArray){
    $('tbody>tr').remove();
    for(var studentIndex = 0; studentIndex < updatingStudentArray.length; studentIndex++){
        renderStudentOnDom(updatingStudentArray[studentIndex]);
    }
    calculateGradeAverage(updatingStudentArray);
}

function calculateGradeAverage(calculateStudentArray){
    var gradeTotal = 0;
    var numberAvg = null;
    for(var student = 0; student < calculateStudentArray.length; student++){
        gradeTotal += parseFloat(calculateStudentArray[student].Grade);
    }

    numberAvg = gradeTotal/calculateStudentArray.length;
    numberAvg.toFixed(2);
    renderGradeAverage(numberAvg);
}

function renderGradeAverage(average){
    if(studentArray.length > 0){
        $('.avgGrade').text(average.toFixed(2));
    }else{
        $('.avgGrade').text(0);
    }
}

function handleDeleteButton(){
    $(this).closest('tr').remove();
}

function loadData(){
    var ajaxOptions= {
        dataType: 'json',
        url: '/api/getAllStudents',
        method:'post',
    }
    $.ajax(ajaxOptions).then(function(response){
        studentArray = response.data;
        updateStudentList(studentArray)
        $(".fa-spin").hide()
    });
}

function handleError(theError){
    $(".fa-spin").hide()
    failedQueryModal()
}

function sendNewStudentData(name, grade, course){
    try{
    var ajaxAdd = {
        dataType: 'json',
        url: "/api/addStudent",
        method: 'post',
        data:{ name: name, grade: grade, course: course},
        error: handleError
    }
    $.ajax(ajaxAdd).then(function(response){
        var studentObj = {
            name: name,
            course: course,
            grade: grade,
            id: response.data.insertId
        }
        clearAddStudentFormInputs();
        studentArray.push(studentObj);
        updateStudentList(studentObj);
        loadData();
    })
    }catch(error){
        handleError(error);
    }
}

function validationSignUp(){
    const tests = [
        {
            element: "input[name=emailSignUp]",
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            message: 'must be a valid email address'
        },

        {
            element: "input[name=passwordSignUp]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital and a number'
        },
        {
            element: "input[name=passwordConfirm]",
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
            message: 'Must have one at least eight characters, one capital, a number and match the password above'
        },
    ];

    if( tests.length === tests.filter( validateInputAndDisplayError).length){
        if(checkPasswords()) {
            SignUserIn();
        } else {
            const message = "Both passwords must match!";
            $("input[name=passwordConfirm]").next().text( message ).css("color", "red");
        }

    }
}

function validateInputAndDisplayError( incomingTests ){
    const element = incomingTests.element, pattern = incomingTests.pattern, errorMessage = incomingTests.message;
    const value = $( element ).val();
    const result = pattern.test( value );
    if( !result ){
        $( element ).next().text( errorMessage ).css("color", "red");
    } else {
        $( element ).next().text('');
    }
    return result;
}

function SignUserIn() {
    const Email = $('input[name=emailSignUp]').val();
    const Password = $('input[name=passwordConfirm]').val();
    $.ajax({
        method: "POST",
        url: "/api/SignUp",
        data: {
            Email,
            Password
        }
    }).then((response) => {
        if(response.success) {
            localStorage.setItem("token", response.token);
            location.replace("/");
        } else {
            $('.errorMessageSignUp').css("display", "block").css("color", "red").text(response.message);
        }
    })
}

function checkPasswords() {
    const password1 = $('input[name=passwordConfirm]').val();
    const password2 = $('input[name=passwordSignUp]').val();
    if(password1 === password2) {
        return true;
    } else {
        return false;
    }
};


function gradeValidation(){
    let inputFeedback = $("<div class='gradeFeedback'>").addClass("invalid-feedback");
    const gradeRegex = /^[1-9]\d*(\.\d+)?$/;
    const grade = $("#studentGrade").val();
    const editGrade = $("#editGrade").val();

    if(grade){
        if((!gradeRegex.test(grade) && grade !=='') || parseInt(grade)< 0 || grade ==='' ){
            if($("gradeDiv").hasClass("has-error")){
                return
            }
            $(".gradeFeedback").remove();
            $("#gradeDiv").append(inputFeedback.text("Not a valid Grade"));
            $("#gradeDiv").addClass("has-error");
            return;
        }else{
            $(".gradeFeedback").remove();
            $("#gradeDiv").removeClass("has-error");
            $("#gradeDiv").removeClass("has-warning");
            $("#gradeDiv").addClass("has-success");
        }
        if (grade.length> 6){
        $(".gradeFeedback").remove();
        $("#gradeDiv").removeClass("has-error");
        $("#gradeDiv").removeClass("has-warning");
        $("#gradeDiv").addClass("has-error");
        $("#gradeDiv").append(inputFeedback.text("Grade exceeds maximum length"));
        return;
        }
    }

    if(editGrade){
        if((!gradeRegex.test(editGrade) && editGrade !=='') || parseInt(editGrade)<0 || editGrade ==''){
            if($("#editGradeDiv").hasClass("has-error")){
                return;
            }
            $(".gradeFeedback").remove();
            $("#editGradeDiv").append(inputFeedback.text("Not a Valid Number"));
            $("#editGradeDiv").addClass("has-error");
            return
        }else{
            $(".gradeFeedback").remove();
            $("#editGradeDiv").removeClass("has-error");
            $("#editGradeDiv").removeClass("has-warning");
            $("#editGradeDiv").addClass("has-success");
        }
        if (editGrade.length> 5){
            $(".gradeFeedback").remove();
            $("#editGradeDiv").removeClass("has-error");
            $("#editGradeDiv").removeClass("has-warning");
            $("#editGradeDiv").addClass("has-error");
            $("#editGradeDiv").append(inputFeedback.text("Grade exceeds maximum length"));
            return;
        }
    }
}

function nameValidation(){
    inputFeedback2 = $("<div class='studentNameFeedback'>").addClass("invalid-feedback");
    const studentNameRegex = /^[a-z ,.'-]+$/i;
    const studentName = $("#studentName").val();
    const editName = $("#editStudentName").val();
    if(studentName){
        if(!studentNameRegex.test(studentName) && studentName !=='' || studentName ==''){
            if($("#nameDiv").hasClass("has-error")){
                return;
            }
            $("#nameDiv").addClass("has-error");
            $("#nameDiv").append(inputFeedback2.text("Invalid Student Name"));
            return;
        }else{
            $(".studentNameFeedback").remove();
            $("#nameDiv").removeClass("has-error");
            $("#nameDiv").removeClass("has-warning");
            $("#nameDiv").addClass("has-success");
        }
        if (studentName.length> 42){
        $(".studentNameFeedback").remove();
        $("#nameDiv").removeClass("has-error");
        $("#nameDiv").removeClass("has-warning");
        $("#nameDiv").addClass("has-error");
        $("#nameDiv").append(inputFeedback2.text("Student Name exceeds maximum length"));
        return;
        }
    }
    if(editName){
        if((!studentNameRegex.test(editName) && editName!=='') || editName ===''){
            if($("#editNameDiv").hasClass("has-error")){
                return;
            }
            $("#editNameDiv").addClass("has-error");
            $("#editNameDiv").append(inputFeedback2.text("Invalid Student Name"));
            return;
        }else{
            $(".studentNameFeedback").remove();
            $("#editNameDiv").removeClass("has-error");
            $("#editNameDiv").removeClass("has-warning");
            $("#editNameDiv").addClass("has-success");
        }
        if(editName.length > 42){
            $(".studentNameFeedback").remove();
            $("#editNameDiv").removeClass("has-error");
            $("#editNameDiv").removeClass("has-warning");
            $("#editNameDiv").addClass("has-error");
            $("#editNameDiv").append(inputFeedback2.text("Student Name exceeds maximum length"));
            return;
        }   
    }
}
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

