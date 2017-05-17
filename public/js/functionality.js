window.onload = function() {


    const projectDltBtn = document.getElementById('project-delete-btn'),
        profileDltBtn = document.getElementById('profile-delete-btn')


    // =============================== //
    //  project DELETE event listener  //
    // =============================== //
    $('#project-delete-btn').on('click', function() {
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
    })

    
    // =============================== //
    //  profile DELETE event listener  //
    // =============================== //
    $('#profile-delete-btn').on('click', function() {
        console.log(window.location.pathname)
        swal({
            title: "Are you sure you want to delete this account?",
            text: "Doing so will remove all projects from the website.",
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
                            window.location.replace('/')
                            // give control to the route
                        }
                    }))
                })
            }
        })
    })
}