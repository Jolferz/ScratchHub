'use strict'

window.onload = function () {

    // =============================== //
    //  project DELETE event listener  //
    // =============================== //
  $('#project-delete-btn').on('click', function () {
    console.log(window.location.pathname)
    swal({
      title: 'Delete this project?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd6b55',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: function () {
        return new Promise(function (resolve) {
          resolve($.ajax({
            url: window.location.pathname + '/project-delete',
            method: 'DELETE',
            contentType: 'application/json',
            success: function (res) {
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
  $('#profile-delete-btn').on('click', function () {
    console.log(window.location.pathname)
    swal({
      title: 'Delete this account?',
      text: 'Doing so will permanently remove all projects.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd6b55',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: function () {
        return new Promise(function (resolve) {
          resolve($.ajax({
            url: window.location.pathname + '/profile-delete',
            method: 'DELETE',
            contentType: 'application/json',
            success: function (res) {
              window.location.replace('/')
                            // give control to the route
            }
          }))
        })
      }
    })
  })

    // =============================== //
    //     login username lowercase    //
    // =============================== //

  $('#login-submit').on('click', function () {
    let str
    str = document.getElementById('username')
    str.value = (str.value.toLowerCase())

        // get the form id and submit it
    let form = document.getElementById('login')
    form.submit()
  })
}
