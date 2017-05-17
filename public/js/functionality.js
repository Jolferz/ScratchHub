window.onload = function() {

    // let projectDltBtn = document.getElementById('project-delete-btn')
    let profileDltBtn = document.getElementById('profile-delete-btn')

    // project delete
    projectDltBtn.onclick = function() {
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
                            window.location.replace('/latest')
                            // give control to the route
                        }
                    }))
                })
            }
        })
    }

    // profile delete
    profileDltBtn.onclick = function() {
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
                        url: window.location.pathname + '/profile-delete',
                        method: 'DELETE',
                        contentType: 'application/json',
                        success: function(res) {
                            window.location.replace('/latest')
                            // give control to the route
                        }
                    }))
                })
            }
        })
    }
}