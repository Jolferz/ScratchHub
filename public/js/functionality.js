let deleteButton = document.getElementById('delete-btn')

deleteButton.onclick = function() {
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
                    url: '/project/project-delete',
                    method: 'DELETE',
                    contentType: 'application/json',
                    xml: window.location.pathname,
                    success: function(res) {
                        // give control to the route
                    }
                }))
            })
        }
    })
}
