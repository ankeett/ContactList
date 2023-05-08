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
    const tbody = document.getElementById('list-items');
    

    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }

    const places = response.data;
    for (const place of places) {
        let marker = L.marker([place.latitude, place.longitude]).addTo(map)
            .bindPopup(`<b>${place.firstname} ${place.lastname}</b><br/>${place.address}`).openPopup();
        markers.push(marker);
    }


    if (response && response.data) {
        for (const place of response.data) {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.id = `list-item-${place.id}`;
            li.dataset.lat = place.latitude;
            li.dataset.lng = place.longitude;
            
            li.addEventListener('click', () => {
                console.log('here');
                const lat = li.dataset.lat;
                const lng = li.dataset.lng;
                console.log(lat, lng);
                map.flyTo(new L.LatLng(lat, lng));
              });
            li.innerHTML = `
                <div class="row">
                    <div class="col-lg-2 col-xs-12">
                        <a href="/${place.id}">${place.title} ${place.firstname} ${place.lastname}</a>
                    </div>
                    <div class="col-lg-4 col-xs-12">
                        <span>${place.address}</span>
                    </div>
                    <div class="col-lg-3 col-xs-12">
                        <div class="row">
                            <div class="col-12">
                                <span>${place.phone}</span>
                            </div>
                            <div class="col-12">
                                <span>${place.email}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-xs-12">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" disabled ${place.contact_by_phone ? 'checked' : ''}>
                                    <label class="form-check-label">Phone</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" disabled ${place.contact_by_email ? 'checked' : ''}>
                                    <label class="form-check-label">Email</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" disabled ${place.contact_by_mail ? 'checked' : ''}>
                                    <label class="form-check-label">Mail</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-1 col-xs-12">
                        <div class="d-flex flex-column gap-3">
                        <button class="btn btn-primary" onclick="editPlace(${place.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deletePlace(${place.id})">Delete</button>
                        </div>
                    </div>
                </div>
        `;
        tbody.appendChild(li);

    }
}
}
const viewPlace = async (id) => {
    window.location.href = `/${id}`;
}

const editPlace = async (id) => {
    window.location.href = `/${id}/edit`;
}
const deletePlace = async (id) => {
    window.location.href = `/${id}/delete`;
}
