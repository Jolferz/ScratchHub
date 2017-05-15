let deleteButton = document.getElementById('delete-btn')

deleteButton.onclick = function() {
    console.log(window.location.pathname)
    swal({
        title: "Delete this project?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dd6b55",
        confirmButtonText: "Yes, delete it!",
        preConfirm: function() {
            return new Promise(function(resolve) {
                resolve($.ajax({
                    url: window.location.pathname + '/project-delete',
                    method: 'DELETE',
                    contentType: 'application/json',
                    success: function(res) {
                        // give control to the route
                    }
                }))
            })
        }
    })
}
