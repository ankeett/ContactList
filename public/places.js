let map = 0;
let markers = [];

const loadMap = async () => {
    console.log('Loading map');
    map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

const loadPlaces = async () => {
    const response = await axios.get('/places');
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }

    const places = response.data;
    console.log(places);
    for (const place of places) {
        let marker = L.marker([place.latitude, place.longitude]).addTo(map)
            .bindPopup(`<b>${place.firstname} ${place.lastname}</b><br/>${place.address}`).openPopup();
        markers.push(marker);
    }

    const on_row_click = (e) => {
        let row = e.target;
        if (e.target.tagName.toUpperCase() === 'TD') {
            row = e.target.parentNode;
          
            const lat = row.dataset.lat;
            const lng = row.dataset.lng;
            map.flyTo(new L.LatLng(lat, lng));

        }
      };


    if (response && response.data) {
        for (const place of response.data) {
            const tr = document.createElement('tr');
            tr.dataset.lat = place.latitude;
            tr.dataset.lng = place.longitude;
            tr.addEventListener('click', on_row_click);
            console.log(place)
            tr.innerHTML = `
                <td>${place.title}</td>
                <td>${place.firstname} ${place.lastname}</td>
                <td>${place.address}</td>
                <td>${place.phone}</td>
                <td>${place.email}</td>
                <td>
                    <input type='checkbox' ${place.contact_by_email ? 'checked' : ''} disabled>Contact By Email </input>
                    </br>
                    <input type='checkbox' ${place.contact_by_phone ? 'checked' : ''} disabled>Contact By Phone </input>
                    </br>
                    <input type='checkbox' ${place.contact_by_mail ? 'checked' : ''} disabled>Contact By Mail </input>
                </td>
                <td>
                    <div class='d-flex flex-column gap-3 mt-2'>
                        <button class='btn btn-primary' onclick='viewPlace(${place.id})'>View</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        }

    }
}
const viewPlace = async (id) => {
    window.location.href = `/${id}`;
}



