$(document).ready(() => {
    let addressArray = [];

    let clusterMarkers = [];

    let eventLocation;
    let buses = 0;
    let clusters = [];
    const geocoder = new google.maps.Geocoder;
    let infowindow = new google.maps.InfoWindow({});
    for (let i = 0; i < STRING_ARRAY.length; i++) {
        console.log(STRING_ARRAY[i]);
        $('#address').val(STRING_ARRAY[i].trim());
        handleAdd();
    }
    var latlng = new google.maps.LatLng(31.526446, -99.3420866);
    let map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: 6,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ]
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            handleAdd();
        }
    });

    $("#add").click(handleAdd);
    $('#eventLocation').change(e => {
        eventLocation = $('#eventLocation').val();

        geocoder.geocode({
            'address': eventLocation
        }, (res, status) => {

            $('#eventLocation').val(res[0].formatted_address);
            let marker = new google.maps.Marker({
                position: res[0].geometry.location,
                icon: 'darkgreen_MarkerE.png',
                map: map
            });
            let currentBounds = map.getBounds();
            let markerPos = marker.getPosition();

            // adjust the viewport
            if (!currentBounds.contains(markerPos)) {
                let newBounds = currentBounds.extend(markerPos);
                map.fitBounds(newBounds);
            }

            google.maps.event.addListener(marker, 'click', ((marker) => {
                return () => {
                    infowindow.setContent("Event location")
                    infowindow.open(map, marker);
                }
            })(marker));
        });

    });
    $('#submit').click(() => {
        buses = $('#numBuses').val();

        // let a = calcMidpoint();
        clusters = getClusters();
        console.log(clusters);
        markOnMap();
    });

    function handleAdd(e) {
        let curInput = $('#address').val().trim();

        if (curInput.length == 0) {
            alert('enter address');
            return;
        }

        geocoder.geocode({
            'address': curInput
        }, (res, status) => {
            console.log(status);
            // append the res to the list showing address
            if (status == "OK") {

                addressArray.push(res[0]);
                $('#address').val('')
                rebuildBox();

                let marker = new google.maps.Marker({
                    position: res[0].geometry.location,
                    icon: 'paleblue_MarkerP.png',
                    map: map
                });
                let currentBounds = map.getBounds();
                let markerPos = marker.getPosition();

                // adjust the viewport
                if (!currentBounds.contains(markerPos)) {
                    let newBounds = currentBounds.extend(markerPos);
                    map.fitBounds(newBounds);
                }

                google.maps.event.addListener(marker, 'click', ((marker) => {
                    return () => {
                        infowindow.setContent(res[0].formatted_address)
                        infowindow.open(map, marker);
                    }
                })(marker));
            }
        });
    }
    function rebuildBox() {
        let len = addressArray.length;
        let str = ``;
        for (let i = 0; i < len; i++) {
            let cur = addressArray[i];
            str += `<div>${cur.formatted_address}</div>`;
        }
        // set the box to str
        $('#locations').html(str);
    }

    function getClusters() {
        let len = addressArray.length;

        let coordinates = [];
        for (let i = 0; i < len; i++) {
            let cur = addressArray[i];
            let out = [cur.geometry.location.lat(), cur.geometry.location.lng()];
            coordinates.push(out);
        }
        //number of clusters, defaults to undefined
        clusterMaker.k(buses);

        //number of iterations (higher number gives more time to converge), defaults to 1000
        clusterMaker.iterations(750);

        //data from which to identify clusters, defaults to []
        clusterMaker.data(coordinates);

        return clusterMaker.clusters();
    }

    function markOnMap() {
        // remove previous cluster markers
        for (let i = 0; i < clusterMarkers.length; i++) {
            clusterMarkers[i].setMap(null);
        }
        // now plot the bus stops
        for (let i = 0; i < clusters.length; i++) {
            let cur = clusters[i];
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(cur.centroid[0], cur.centroid[1]),
                icon: 'purple_MarkerB.png',
                setLabel: "Bus stop",
                map: map
            });
            clusterMarkers.push(marker);
            google.maps.event.addListener(marker, 'click', ((marker, i) => {
                return () => {
                    infowindow.setContent("Bus stop")
                    infowindow.open(map, marker);
                }
            })(marker, i));

        }
    }
});