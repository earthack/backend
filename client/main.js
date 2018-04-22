$(document).ready(() => {
    let addressArray = [];
    let buses = 0;
    console.log(google);
    const geocoder = new google.maps.Geocoder;
        
    //number of clusters, defaults to undefined
    clusterMaker.k(3);
    
    //number of iterations (higher number gives more time to converge), defaults to 1000
    clusterMaker.iterations(750);
    
    //data from which to identify clusters, defaults to []
    clusterMaker.data([[1, 0], [0, 1], [0, 0], [-10, 10], [-9, 11], [10, 10], [11, 12]]);
    
    console.log(clusterMaker.clusters());

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
        buses = $('#numBuses').val();

        let a = calcMidpoint();
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

    function calcMidpoint() {
        let midLat = 0;
        let midLong = 0;
    
        let x = 0;
        let y = 0;
        let z = 0;
    
        // temp lat long for loop
        let tempLat, tempLong;
        // temp cartesian coordinates
        let tempX, tempY, tempZ;
    
        for (let i = 0; i < addressArray.length; i++) {
            let curLocation = addressArray[i];
            tempLat = curLocation.geometry.location.lat() * (Math.PI/180);
            tempLong = curLocation.geometry.location.lng() * (Math.PI/180);

            tempX = Math.cos(tempLat) * Math.cos(tempLong);
            tempY = Math.cos(tempLat) * Math.sin(tempLong);
            tempZ = Math.sin(tempLat);

            x += tempX;
            y += tempY;
            z += tempZ;
        }

        x = x/addressArray.length;
        y = y/addressArray.length;
        z = z/addressArray.length;
        midLong = Math.atan2(y,x);
        let hypotenuse = Math.sqrt(x * x + y * y);
        midLat = Math.atan2(z, hypotenuse);

        midLat = toDegFromRad(midLat);
        midLong = toDegFromRad(midLong);
        console.log(midLat);
        console.log(midLong);
        // now we have the coordinates of the midpoint!
        let point = new google.maps.LatLng(midLat, midLong);
        console.log(point.toJSON());

    }
    function toDegFromRad(rd) {
        return (rd * 180/Math.PI);
    }

    function initMap() {

    }
});