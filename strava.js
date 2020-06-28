
const auth_link = "https://www.strava.com/oauth/token"

function usingSpecificData(data){
	console.log(data)
}


function usingData(data, filter='', filterTime=''){

	console.log(data)
	//document.location.reload(false)
	var today = new Date()

	data_principal.innerHTML = ''


	var activityId = 0


	for(var e = 0; e < data.length; e++){

		data[e]['activityId'] = activityId

		activityId ++
	

		if(filter != ''){
			if(filter != data[e]['type']){
				continue
			}
		}
		if(filter != ''){
		if(filter != data[e]['type']){
			continue
		}
		}

		if(filterTime != ''){
			
			if(filterTime == 'Today'){
				if (parseInt(data[e]['start_date'].slice(0,4)) != today.getFullYear() || parseInt(data[e]['start_date'].slice(5,7)) != (today.getMonth() + 1) || parseInt(data[e]['start_date'].slice(8,10)) != today.getDate()) {
					continue
				}
				
				
			}
			else if(filterTime == 'ThisMonth'){
				if (parseInt(data[e]['start_date'].slice(0,4)) != today.getFullYear() || parseInt(data[e]['start_date'].slice(5,7)) != (today.getMonth() + 1)) {
					continue
				}
			}

			else if(filterTime == 'ThisYear'){
				if (parseInt(data[e]['start_date'].slice(0,4)) != today.getFullYear()) {
					continue
				}
			}

		
		}



		let paceSeconds = 0
		let paceMinutes = 0
		
		if (data[e]['type'] == 'Run'){
				

				paceSeconds = parseInt(data[e]['moving_time'] * 1000 / parseFloat(data[e]['distance']))

				while(paceSeconds >= 60){
					paceSeconds -= 60
					paceMinutes += 1
				}
				
		}



		

		let divCard = document.createElement('div')
		divCard.className = 'card mb-3 card-strava'

		let divCardHeader = document.createElement('div')
		divCardHeader.className = 'card-header'
		divCardHeader.innerHTML = data[e]['type']

		let divCardBody = document.createElement('div')
		divCardBody.className = 'card-body'


		let h5 = document.createElement('h5')
		h5.className = 'card-title ml-3'
		h5.innerHTML = data[e]['name']

		let p0 = null
		let p3 = null

		if (data[e]['type'] == 'Run' || data[e]['type'] == 'Ride' || data[e]['type'] == 'VirtualRide'){
			p0 = document.createElement('p')
			p3 = document.createElement('p')
			p3.className = 'card-text'
			p0.className = 'card-text'
			let distance = 0

			if(data[e]['type'] == 'VirtualRide'){
				distance = data[e]['name'].replace('km', '')
				distance = parseFloat(distance.replace(',', '.'))
			}
			else{
				distance = parseFloat(data[e]['distance']) / 1000
			}

			p0.innerHTML = 'Distance: <strong>' + distance.toFixed(2) + 'Km</strong>' 
			let speed =  (distance * 1000 / data[e]['moving_time']) * 3.6 
			p3.innerHTML = 'Average speed: <strong>' + speed.toFixed(1) + 'Km/h</strong>' 



		}
		



		let p1 = document.createElement('p')
		let p2 = document.createElement('p')
		let p4 = document.createElement('p')
		p1.className = 'card-text'
		p2.className = 'card-text'
		p4.className = 'card-text'

		var d = new Date()
		let duration = data[e]['moving_time']  
		let durationHour = Math.floor(duration / 3600, 2)
		let durationMinutes = Math.floor((duration - Math.floor(duration / 3600) * 3600) / 60)
		let durationSeconds = duration - (durationHour * 3600 + durationMinutes * 60)
		d.setHours(durationHour)
		d.setMinutes(durationMinutes)
		d.setSeconds(durationSeconds)
		let hour = d.toString().slice(15, 24)

		p1.innerHTML = 'Duration: <strong>' + hour + '</strong>'
		p2.innerHTML = 'Average Heart Rate: <strong>' + data[e]['average_heartrate'] + '</strong>'




		
		//divCardBody.appendChild(a)
		document.getElementById('data_principal').appendChild(divCard)

		divCard.appendChild(divCardHeader)
		divCard.appendChild(divCardBody)
		divCardBody.appendChild(h5)

		if (data[e]['type'] == 'Run' || data[e]['type'] == 'Ride' || data[e]['type'] == 'VirtualRide'){divCardBody.appendChild(p0)}
		divCardBody.appendChild(p1)	
		if (data[e]['type'] == 'Run' || data[e]['type'] == 'Ride' || data[e]['type'] == 'VirtualRide'){divCardBody.appendChild(p3)}
		divCardBody.appendChild(p2)

		if (data[e]['type'] == 'Run' ) {
			p4.innerHTML = 'Average pace: <strong>' + paceMinutes + ':' + paceSeconds + ' min/Km </strong>'
			divCardBody.appendChild(p4)}

}


	
}







function getActivites(res, filter='', filterTime = ''){
	//console.log(res.access_token)
	let filter1 = filter
	let filter2 = filterTime
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`
    fetch(activities_link)
        .then((res) => res.json())
        .then((data) => usingData(data, filter1, filter2))
     
        
}



function reAuthorize(select='', selectPeriod=''){
	let filter = select
	let filterTime = selectPeriod
    fetch(auth_link,{
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            client_id: 'xxxxx',
            client_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            refresh_token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            grant_type: 'refresh_token'
        })
    }).then(res => res.json())
    	.then(res => getActivites(res, filter, filterTime))
    
      
}





reAuthorize()












