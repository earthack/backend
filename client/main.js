$(document).ready(() => {
    console.log('he');
    console.log(google);

    let addressArray = [];

    const geocoder = new google.maps.Geocoder;
    $("#add").click(e => {
        let curInput = $('#address').val().trim();
        
        if (curInput.length == 0) {
            alert('enter address');
            return;
        }

        geocoder.geocode({
            'address': curInput
        }, (res, status) => {
            // append the res to the list showing address
            if (status == "OK") {
                addressArray.push(res[0]);
                $('#address').val('')
                rebuildBox();
            }
        });
    });

    $('#submit').click(() => {
        let buses = $('#numBuses').val();
        // send to api
        let server = {
            buses: buses,
            locations: addressArray
        };
        console.log(server);

        $.ajax({
            type: "POST",
            url: '/api/midpoint',
            data: data,
            success: (data) => {
                console.log(data);

            },
        });
    });
    function rebuildBox() {
        let len = addressArray.length;
        console.log(addressArray);
        let str = ``;
        for (let i = 0; i < len; i++) {
            let cur = addressArray[i];
            str += `<div>${cur.formatted_address}</div>`;
        }
        // set the box to str
        $('#locations').html(str);
    }
});