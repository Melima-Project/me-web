var $registerButton, $email, $password, $email2, $password2, $password2c, 
	$registerErrorBlock, $logoutLink, $logout, $loginErrorBlock, $loginButton, $searchIdErrorBlock, $createNewItemErrorBlock, $createNewItemButton,
    $listLast20, $listLast50, $listLast100, $listAll, $listAllReadOnly, $listAllReverse,
    $searchOrderIdErrorBlock,
    $listOrderLast20, $listOrderLast50, $listOrderLast100, $listOrderLast500, $listOrderAll, $listOrderAllReadOnly, $listOrderAllReverse, $registerShow, $registerHide;
var token, userid;
var interval1, interval2;
var template = $.templates("#tpl");
var templateOdr = $.templates("#tplOdr");
var templateActive = $.templates("#tplActive");
var templateFinished = $.templates("#tplFinished");
var divAndClose = `<div id=formListCollapse><button type="button" class="close" data-toggle="collapse" data-target="#formListCollapse" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
var divAndCloseOdr = `<div id=formOrderListCollapse><button type="button" class="close" data-toggle="collapse" data-target="#formOrderListCollapse" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
var divAndCloseSearchOrg = `<div id=formCollapse><button type="button" class="close" data-toggle="collapse" data-target="#formCollapse" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
var divAndCloseSearchOdr = `<div id=formOrderCollapse><button type="button" class="close" data-toggle="collapse" data-target="#formOrderCollapse" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
var div = `</div>`;
var tablehead1 = `<table class="table table-sm table-responsive"><thead><tr><th>ID</th><th>Table</th><th>Name</th><th>Count</th><th>Price</th><th>Wishes</th></tr></thead><tbody><tr>`;
var tablehead2 = `</tbody></table>`;

$(document).ready(function() {
	$registerButton = $('#registerButton');
	$email = $('#email');
	$password = $('#password');
	$email2 = $('#email2');
	$password2 = $('#password2');
	$password2c = $('#password2c');
	$registerErrorBlock = $('#registerErrorBlock');
	$logoutLink = $('#logoutLink');
	$logout = $('#logout');
	$loginErrorBlock = $('#loginErrorBlock');
	$loginButton = $('#loginButton');
	$loginButton.on('click', doLogin);
	$registerButton.on('click', doRegister);
	$logout.on('click', doLogout);
    $searchById = $('#searchById');
    $searchById.on('click', searchById);
    $searchIdErrorBlock = $('#searchIdDisplayBlock');
    $searchBySN = $('#searchBySN');
    $searchBySN.on('click', searchBySN);
    $searchByName = $('#searchByName');
    $searchByName.on('click', searchByName);
    $createNewItem = $('#createNewItem');
    $createNewItem.on('click', createNewItem);
    $listLast20 = $('#listLast20');
    $listLast20.on('click', listLast20);
    $listLast50 = $('#listLast50');
    $listLast50.on('click', listLast50);
    $listLast100 = $('#listLast100');
    $listLast100.on('click', listLast100);
    $listAll = $('#listAll');
    $listAll.on('click', listAll);
    $listAllReadOnly = $('#listAllReadOnly');
    $listAllReadOnly.on('click', listAllReadOnly);
    $listAllReverse = $('#listAllReverse');
    $listAllReverse.on('click', listAllReverse);
    $searchOrderById = $('#searchOrderById');
    $searchOrderById.on('click', searchOrderById);
    $searchOrderIdErrorBlock = $('#searchOrderIdDisplayBlock');
    $searchOrderByTable = $('#searchOrderByTable');
    $searchOrderByTable.on('click', searchOrderByTable);
    $searchOrderByName = $('#searchOrderByName');
    $searchOrderByName.on('click', searchOrderByName);
    $createOrderNewItem = $('#createOrderNewItem');
    $createOrderNewItem.on('click', createOrderNewItem);
    $listOrderLast20 = $('#listOrderLast20');
    $listOrderLast20.on('click', listOrderLast20);
    $listOrderLast50 = $('#listOrderLast50');
    $listOrderLast50.on('click', listOrderLast50);
    $listOrderLast100 = $('#listOrderLast100');
    $listOrderLast100.on('click', listOrderLast100);
    $listOrderLast500 = $('#listOrderLast500');
    $listOrderLast500.on('click', listOrderLast500);
    $listOrderAll = $('#listOrderAll');
    $listOrderAll.on('click', listOrderAll);
    $listOrderAllReadOnly = $('#listOrderAllReadOnly');
    $listOrderAllReadOnly.on('click', listOrderAllReadOnly);
    $listOrderAllReverse = $('#listOrderAllReverse');
    $listOrderAllReverse.on('click', listOrderAllReverse);
    $registerShow = $('#registerShow');
    $registerShow.on('click', registerShow);
    $registerHide = $('#registerHide');
    $registerHide.on('click', registerHide);
    $.validate();
    
});

function doRegister(e) {
	e.preventDefault();
	console.log('doRegister');
	var errors = '';
	if($email2.val() === '') errors += 'Email is required.<br/>';
	if($password2.val() === '') errors += 'Password is required.<br/>';
	if($password2c.val() != $password2.val()) errors += 'Confirmation password didn`t match.<br/>';
	if(errors != '') {
		$registerErrorBlock.html(`
		<div class="alert alert-danger" role="alert">
		<strong>Please correct these errors:</strong><br/>${errors}
		</div>`);
	} else {
		$registerErrorBlock.html('<em>Stand by - trying to register...');
		var user = { email:$email2.val(), password:$password2.val()};
		$.post('/api/appusers', user).then(function(res) {
			//success, now immediately followup with a login
			userid = res.id;
			$.post('/api/users/login', user).then(function(res) {
				console.log(res);
				token = res.id;
				$('#login').modal('hide');
				$logoutLink.show();
			});
		}).catch(function(e) {
			console.log('catch block');
			var error = e.responseJSON.error.message;
			console.log(error);
			// for now, assume only error is dupe
			$registerErrorBlock.html(`
			<div class="alert alert-danger" role="alert">
			<strong>Please correct these errors:</strong><br/>Sorry, but registration is disabled.
			</div>`);

		});
	}
}

function doLogin(e) {
	e.preventDefault();
	console.log('doLogin');
	var errors = '';
	if($email.val() === '') errors += 'Email is required.<br/>';
	if($password.val() === '') errors += 'Password is required.<br/>';
	if(errors != '') {
		$loginErrorBlock.html(`
		<div class="alert alert-danger" role="alert">
		<strong>Please correct these errors:</strong><br/>${errors}
		</div>`);
	} else {
		var user = { email:$email.val(), password:$password.val()};
        $.post('/api/users/login', user).then(function(res) {
			token = res.id;
			userid = res.userId;
			$('#login').modal('hide');
			$logoutLink.show();
            $('#loginStart').hide();
            $('#melima').show();
            interval1 = setInterval(function(){listOrderActiveMonitor()}, 30000);
            interval2 = setInterval(function(){listOrderFinishedMonitor()}, 30000);
		}).catch(function(e) {
			var error = e.responseJSON.error.message;
			console.log(error);
			$loginErrorBlock.html(`
			<div class="alert alert-danger" role="alert">
			<strong>Please correct these errors:</strong><br/>Your login did not work.
			</div>`);

		});
	}
}

function doLogout(e) {
	e.preventDefault();
	$.ajax({
		type:'post',
		url:'/api/users/logout',
		headers:{
			'Authorization':token
		}
	}).then(function() {
		userid = '';
		token = '';
		$logoutLink.hide();
        $('#password').val("");
        $('#melima').hide();
        $('#loginStart').show();
        clearInterval(interval1);
        clearInterval(interval2);
	});
}

function searchById(e) {
	e.preventDefault();
    $('#formCollapse').remove();
    console.log('searchById');
    var formdata = $('#formGroupSearchId').val();
    var url = '/api/pd/' + formdata;
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
		}
	}).then(function(data) {
        var htmlOutput = template.render(data);
        $(searchIdDisplayBlock).append(htmlOutput);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
        var searchIdErrorBlock = $searchIdErrorBlock.html(`
        <div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>ID ` +formdata+ ` not found.</div>`);
    });
}

function searchBySN(e) {
	e.preventDefault();
    $('#formCollapse').remove();
    console.log('searchBySN');
    var formdata = $('#formGroupSearchSN').val();
    var url = '/api/pd?filter[where][SerialNumber]=' +formdata+ '&filter[limit]=20';
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        if (!$.trim(data)){   
        var searchSNErrorBlock = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>Serial number ` +formdata+ ` not found.</div>`;
        $('#searchSNDisplayBlock').append(searchSNErrorBlock);
        }
        else{
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputPlusEditFinal = divAndCloseSearchOrg + htmlOutputPlusEdit + div;
        $(searchSNDisplayBlock).append(htmlOutputPlusEditFinal);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formCollapse').collapse();
        $.validate();
        }
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function searchByName(e) {
	e.preventDefault();
    $('#formCollapse').remove();
    console.log('searchByName');
    var formdata = $('#formGroupSearchName').val();
    var url = '/api/pd?filter[where][Name]=' +formdata+ '&filter[limit]=20';
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        if (!$.trim(data)){
        var searchNameErrorBlock = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>Name ` +formdata+ ` not found.</div>`;
        $('#searchNameDisplayBlock').append(searchNameErrorBlock);
        }
        else{
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputPlusEditFinal = divAndCloseSearchOrg + htmlOutputPlusEdit + div;
        $(searchNameDisplayBlock).append(htmlOutputPlusEditFinal);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formCollapse').collapse();
        $.validate();
        }
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function createNewItem() {
    $('#formCollapse').remove();
    console.log('createNewItem');
    var create = `<button class='btn btn-primary' type=submit id=createNewItemButton>Create</button>`;
    var templateOrg = $('#tpl').html();
    var templateTemp = templateOrg.replace(/<div class="btn-group.*?<\/button><\/div>/g, create);
    var clearTemplate = templateTemp.replace(/{\{.*?}\}/g, "");
    $(createNewItemDisplayBlock).append(clearTemplate);
    $createNewItemButton = $('#createNewItemButton');
    $createNewItemButton.on('click', createNewItemButton);
    $('#formCollapse').collapse();
    $.validate();
}

function createNewItemButton(e) {
	e.preventDefault();
    console.log('createNewItemButton');
    var newInput = {
        "Name": $('#formGroupName').val(),
        "Price": parseFloat($('#formGroupPrice').val()),
        "CountAvailable": parseFloat($('#formGroupCountAvailable').val()),
        "DiscountPercent": parseFloat($('#formGroupDiscountPercent').val()),
        "Description": $('#formGroupDescription').val(),
        "SerialNumber": parseFloat($('#formGroupSerialNumber').val())
};
    var dataString = JSON.stringify(newInput, null, 2);
    $.ajax({
        data:dataString,
		url:'/api/pd',
        type:"POST",
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var successCreatedItem = `<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Item created:</strong><br/> ` +data.Name+ ` with ID: ` +data.id+ `</div>`;
            $('#newItemResponseDisplayBlock').append(successCreatedItem);
            $('#formCollapse').remove();
            $('#formCollapse').collapse();
        },
        error: function(data) {
            var validationError = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>`+data.responseJSON.error.message+`</div>`
            $('#newItemResponseDisplayBlock').append(validationError);
            console.log(data);
        },
		headers:{
			'Authorization':token
		}
    });
}

function destroyItem(e) {
	e.preventDefault();
    var formdata = ($(this).attr("id")).replace(/removeItemButton/g, '');
    console.log('destroyItem');
    var url = '/api/pd/' + formdata;
	$.ajax({
		url:url,
        type: 'DELETE',
        success: function (data) {
            var successRemovedItem =`<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Item removed:</strong><br/>Item with ID ` +formdata+ ` has been removed.</div>`
            $('#searchIdDisplayBlock').append(successRemovedItem);
            $('#formCollapse').collapse();
            $('#formListCollapse').collapse();
            $('#formCollapse').remove();
            $('#formListCollapse').remove();
        },
        error: function(data) {
            var deletionError = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>`+data.responseJSON.error.message+`</div>`
            $('#searchIdDisplayBlock').append(deletionError);
            console.log(data);
        },
		headers:{
			'Authorization':token
		}
    });
}

function editItem(e) {
	e.preventDefault();
    var formdata = ($(this).attr("id")).replace(/editItemButton/g, '');
    console.log('editItem');
    var newInput = {
        "Name": $('#formGroupName'+formdata).val(),
        "Price": parseFloat($('#formGroupPrice'+formdata).val()),
        "CountAvailable": parseFloat($('#formGroupCountAvailable'+formdata).val()),
        "DiscountPercent": parseFloat($('#formGroupDiscountPercent'+formdata).val()),
        "Description": $('#formGroupDescription'+formdata).val(),
        "SerialNumber": parseFloat($('#formGroupSerialNumber'+formdata).val())
};
    var url = '/api/pd/' + formdata;
    var dataString = JSON.stringify(newInput, null, 2);
    $.ajax({
        data:dataString,
		url:url,
        type:"PUT",
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var successUpdatedItem = `<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Item updated:</strong><br/> ` +data.Name+ ` with ID: ` +data.id+ `</div>`;
            $('#statusDisplayBlock'+formdata).append(successUpdatedItem);
            $('#formCollapse').collapse();
            $('#formListCollapse').collapse();
        },
        error: function(data) {
            var validationError = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>`+data.responseJSON.error.message+`</div>`
            $('#statusDisplayBlock'+formdata).append(validationError);
            console.log(data);
        },
		headers:{
			'Authorization':token
		}
    });
}

function listLast20(e) {
	e.preventDefault();
    $('#formListCollapse').remove();
    console.log('listLast20');
    var url = '/api/pd?filter[order]=id%20DESC&filter[limit]=20'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndClose + htmlOutputPlusEdit + div;
        $('#ListDisplayBlock').append(htmlOutputFinalEdit);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listLast50(e) {
	e.preventDefault();
    $('#formListCollapse').remove();
    console.log('listLast50');
    var url = '/api/pd?filter[order]=id%20DESC&filter[limit]=50'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndClose + htmlOutputPlusEdit + div;
        $('#ListDisplayBlock').append(htmlOutputFinalEdit);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listLast100(e) {
	e.preventDefault();
    $('#formListCollapse').remove();
    console.log('listLast100');
    var url = '/api/pd?filter[order]=id%20DESC&filter[limit]=100'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndClose + htmlOutputPlusEdit + div;
        $('#ListDisplayBlock').append(htmlOutputFinalEdit);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listAll(e) {
	e.preventDefault();
    $('#formListCollapse').remove();
    console.log('listAll');
    var url = '/api/pd'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndClose + htmlOutputPlusEdit + div;
        $('#ListDisplayBlock').append(htmlOutputFinalEdit);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listAllReadOnly(e) {
	e.preventDefault();
    console.log('listAllReadOnly');
    $('#formListCollapse').remove();
    var url = '/api/pd'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var divAndCloseOrg = `<div id=formListCollapse><button type="button" class="close" data-toggle="collapse" data-target="#formListCollapse" aria-label="Close"><span aria-hidden="true">&times;</span></button><pre>`;
        var divOrg = `</pre></div>`;
        var htmlOutputFinalEdit = divAndCloseOrg + JSON.stringify(data, null, 2) + divOrg;
        $('#ListDisplayBlock').append(htmlOutputFinalEdit);
        $('#formListCollapse').collapse();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listAllReverse(e) {
	e.preventDefault();
    $('#formListCollapse').remove();
    console.log('listAllReverse');
    var url = '/api/pd?filter[order]=id%20DESC'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = template.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndClose + htmlOutputPlusEdit + div;
        $('#ListDisplayBlock').append(htmlOutputFinalEdit);
        $editItem = $('*[id^=editItemButton]');
        $editItem.on('click', editItem);
        $removeItemButton = $('*[id^=removeItemButton]');
        $removeItemButton.on('click', destroyItem);
        $('#formListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function searchOrderById(e) {
	e.preventDefault();
    $('#formOrderCollapse').remove();
    console.log('searchOrderById');
    var formdata = $('#formGroupSearchOrderId').val();
    var url = '/api/odr/' + formdata;
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
		}
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        $(searchOrderIdDisplayBlock).append(htmlOutput);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
        var searchOrderIdErrorBlock = $searchOrderIdErrorBlock.html(`
        <div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>ID ` +formdata+ ` not found.</div>`);
    });
}

function searchOrderByTable(e) {
	e.preventDefault();
    $('#formOrderCollapse').remove();
    console.log(searchOrderByTable);
    var formdata = $('#formGroupSearchOrderTable').val();
    var url = '/api/odr?filter[where][Table]=' +formdata+ '&filter[order]=id%20DESC&filter[limit]=20';
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        if (!$.trim(data)){   
        var searchTableErrorBlock = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>Table number ` +formdata+ ` not found.</div>`;
        $('#searchOrderTableDisplayBlock').append(searchTableErrorBlock);
        }
        else{
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputPlusEditFinal = divAndCloseSearchOdr + htmlOutputPlusEdit + div;
        $(searchOrderTableDisplayBlock).append(htmlOutputPlusEditFinal);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderCollapse').collapse();
        $.validate();
        }
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function searchOrderByName(e) {
	e.preventDefault();
    $('#formOrderCollapse').remove();
    console.log('searchByName');
    var formdata = $('#formGroupSearchOrderName').val();
    var url = '/api/odr?filter[where][Name]=' +formdata+ '&filter[order]=id%20DESC&filter[limit]=20';
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        if (!$.trim(data)){
        var searchOrderNameErrorBlock = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>Name ` +formdata+ ` not found.</div>`;
        $('#searchOrderNameDisplayBlock').append(searchOrderNameErrorBlock);
        }
        else{
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputPlusEditFinal = divAndCloseSearchOdr + htmlOutputPlusEdit + div;
        $(searchOrderNameDisplayBlock).append(htmlOutputPlusEditFinal);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderCollapse').collapse();
        $.validate();
        }
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function createOrderNewItem() {
    $('#formOrderCollapse').remove();
    console.log('createOrderNewItem');
    var create = `<button class='btn btn-primary' type=submit id=createOrderNewItemButton>Create</button>`;
    var templateOrg = $('#tplOdr').html();
    var templateTemp = templateOrg.replace(/<div class="btn-group.*?<\/button><\/div>/g, create);
    var clearTemplate = templateTemp.replace(/{\{.*?}\}/g, "");
    $(createOrderNewItemDisplayBlock).append(clearTemplate);
    $createNewItemButton = $('#createOrderNewItemButton');
    $createNewItemButton.on('click', createOrderNewItemButton);
    $('#formOrderCollapse').collapse();
    $.validate();
}

function createOrderNewItemButton(e) {
	e.preventDefault();
    console.log('createOrderNewItemButton');
    var newInput = {
        "Table": parseFloat($('#formOrderGroupTable').val()),
        "Count": parseFloat($('#formOrderGroupCount').val()),
        "ClientName": $('#formOrderGroupClientName').val(),
        "ClientLastName": $('#formOrderGroupClientLastName').val(),
        "PhoneNumber": parseFloat($('#formOrderGroupPhoneNumber').val()),
        "SpecialWishes": $('#formOrderGroupSpecialWishes').val(),
        "Name": $('#formOrderGroupName').val(),
        "Price": parseFloat($('#formOrderGroupPrice').val()),
        "CountAvailable": parseFloat($('#formOrderGroupCountAvailable').val()),
        "DiscountPercent": parseFloat($('#formOrderGroupDiscountPercent').val()),
        "Description": $('#formOrderGroupDescription').val(),
        "SerialNumber": parseFloat($('#formOrderGroupSerialNumber').val()),
        "Finished": parseFloat($('#formOrderFinished').val())
};
    var dataString = JSON.stringify(newInput, null, 2);
    $.ajax({
        data:dataString,
		url:'/api/odr',
        type:"POST",
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var successCreatedItem = `<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Item created:</strong><br/> Table ` +data.Table+ `: ` +data.Name+ ` with ID ` +data.id+ `</div>`;
            $('#newOrderItemResponseDisplayBlock').append(successCreatedItem);
            $('#formOrderCollapse').remove();
            $('#formOrderCollapse').collapse();
        },
        error: function(data) {
            var validationError = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>`+data.responseJSON.error.message+`</div>`
            $('#newOrderItemResponseDisplayBlock').append(validationError);
            console.log(data);
        },
		headers:{
			'Authorization':token
		}
    });
}

function listOrderLast20(e) {
	e.preventDefault();
    $('#formOrderListCollapse').remove();
    console.log('listOrderLast20');
    var url = '/api/odr                                                                                                                                                                                                                                                                                                                            '
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndCloseOdr + htmlOutputPlusEdit + div;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listOrderLast50(e) {
	e.preventDefault();
    $('#formOrderListCollapse').remove();
    console.log('listOrderLast50');
    var url = '/api/odr?filter[order]=id%20DESC&filter[limit]=50'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndCloseOdr + htmlOutputPlusEdit + div;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listOrderLast100(e) {
	e.preventDefault();
    $('#formOrderListCollapse').remove();
    console.log('listOrderLast100');
    var url = '/api/odr?filter[order]=id%20DESC&filter[limit]=100'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndCloseOdr + htmlOutputPlusEdit + div;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listOrderLast500(e) {
	e.preventDefault();
    $('#formOrderListCollapse').remove();
    console.log('listOrderLast500');
    var url = '/api/odr?filter[order]=id%20DESC&filter[limit]=500'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndCloseOdr + htmlOutputPlusEdit + div;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listOrderAll(e) {
	e.preventDefault();
    $('#formOrderListCollapse').remove();
    console.log('listOrderAll');
    var url = '/api/odr'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndCloseOdr + htmlOutputPlusEdit + div;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listOrderAllReadOnly(e) {
	e.preventDefault();
    console.log('listOrderAllReadOnly');
    $('#formOrderListCollapse').remove();
    var url = '/api/odr'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var divAndCloseOrg = `<div id=formOrderListCollapse><button type="button" class="close" data-toggle="collapse" data-target="#formOrderListCollapse" aria-label="Close"><span aria-hidden="true">&times;</span></button><pre>`;
        var divOrg = `</pre></div>`;
        var htmlOutputFinalEdit = divAndCloseOrg + JSON.stringify(data, null, 2) + divOrg;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $('#formOrderListCollapse').collapse();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function listOrderAllReverse(e) {
	e.preventDefault();
    $('#formOrderListCollapse').remove();
    console.log('listOrderAllReverse');
    var url = '/api/odr?filter[order]=id%20DESC'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateOdr.render(data);
        var htmlOutputPlusEditTmp = htmlOutput.replace(/<div id=formOrderCollapse.*?<\/button>/g, '');
        var htmlOutputPlusEdit = htmlOutputPlusEditTmp.replace(/<\/div><\/div>/g, div);
        var htmlOutputFinalEdit = divAndCloseOdr + htmlOutputPlusEdit + div;
        $('#ListOrderDisplayBlock').append(htmlOutputFinalEdit);
        $editOrderItemButton = $('*[id^=editOrderItemButton]');
        $editOrderItemButton.on('click', editOrderItem);
        $removeOrderItemButton = $('*[id^=removeOrderItemButton]');
        $removeOrderItemButton.on('click', destroyOrderItem);
        $('#formOrderListCollapse').collapse();
        $.validate();
    }).catch(function(e) {
        var error = e.responseJSON.error.message;
        console.log(error);
    });
}

function editOrderItem(e) {
	e.preventDefault();
    var formdata = ($(this).attr("id")).replace(/editOrderItemButton/g, '');
    console.log('editOrderItemButton');
    var newInput = {
        "Table": parseFloat($('#formOrderGroupTable'+formdata).val()),
        "Count": parseFloat($('#formOrderGroupCount'+formdata).val()),
        "ClientName": $('#formOrderGroupClientName'+formdata).val(),
        "ClientLastName": $('#formOrderGroupClientLastName'+formdata).val(),
        "PhoneNumber": parseFloat($('#formOrderGroupPhoneNumber'+formdata).val()),
        "SpecialWishes": $('#formOrderGroupSpecialWishes'+formdata).val(),
        "Name": $('#formOrderGroupName'+formdata).val(),
        "Price": parseFloat($('#formOrderGroupPrice'+formdata).val()),
        "CountAvailable": parseFloat($('#formOrderGroupCountAvailable'+formdata).val()),
        "DiscountPercent": parseFloat($('#formOrderGroupDiscountPercent'+formdata).val()),
        "Description": $('#formOrderGroupDescription'+formdata).val(),
        "SerialNumber": parseFloat($('#formOrderGroupSerialNumber'+formdata).val()),
        "Finished": parseFloat($('#formOrderFinished'+formdata).val())
};
    var url = '/api/odr/' + formdata;
    var dataString = JSON.stringify(newInput, null, 2);
    $.ajax({
        data:dataString,
		url:url,
        type:"PUT",
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var successUpdatedItem = `<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Item updated:</strong><br/> ` +data.Name+ ` with ID: ` +data.id+ `</div>`;
            $('#statusOrderDisplayBlock'+formdata).append(successUpdatedItem);
            $('#formOrderCollapse').collapse();
            $('#formOrderListCollapse').collapse();
        },
        error: function(data) {
            var validationError = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>`+data.responseJSON.error.message+`</div>`
            $('#statusOrderDisplayBlock'+formdata).append(validationError);
            console.log(data);
        },
		headers:{
			'Authorization':token
		}
    });
}

function destroyOrderItem(e) {
	e.preventDefault();
    var formdata = ($(this).attr("id")).replace(/removeOrderItemButton/g, '');
    console.log('destroyOrderItem');
    var url = '/api/odr/' + formdata;
	$.ajax({
		url:url,
        type: 'DELETE',
        success: function (data) {
            var successRemovedItem =`<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Item removed:</strong><br/>Item with ID ` +formdata+ ` has been removed.</div>`
            $('#searchOrderIdDisplayBlock').append(successRemovedItem);
            $('#formOrderCollapse').collapse();
            $('#formOrderListCollapse').collapse();
            $('#formOrderCollapse').remove();
            $('#formOrderListCollapse').remove();
        },
        error: function(data) {
            var deletionError = `<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Please correct these errors:</strong><br/>`+data.responseJSON.error.message+`</div>`
            $('#searchOrderIdDisplayBlock').append(deletionError);
            console.log(data);
        },
		headers:{
			'Authorization':token
		}
    });
}

function listOrderActiveMonitor() {
    $('#activeOrders').empty();
    var url = '/api/odr?filter[where][Finished]=false&filter[order]=id%20DESC&filter[limit]=50'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateActive.render(data);
        var active = `<h6>Active</h6>`
        var htmlOutputFinal = active + tablehead1 + htmlOutput + tablehead2;
        $('#activeOrders').append(htmlOutputFinal);
    });
}

function listOrderFinishedMonitor() {
    $('#finishedOrders').empty();
    var url = '/api/odr?filter[where][Finished]=true&filter[order]=id%20DESC&filter[limit]=20'
	$.ajax({
		url:url,
		headers:{
			'Authorization':token
        }
	}).then(function(data) {
        var htmlOutput = templateFinished.render(data);
        var finished = `<h6>Finished</h6>`
        var htmlOutputFinal = finished + tablehead1 + htmlOutput + tablehead2;
        $('#finishedOrders').append(htmlOutputFinal);
    });
}

function registerShow() {
    $('#registerDialog').show();
}

function registerHide() {
    $('#registerDialog').hide();
}
