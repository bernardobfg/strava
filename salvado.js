const auth_link = "https://www.strava.com/oauth/token"

function usingSpecificData(data){
	data_principal.innerHTML = ''
	console.log(data)
}


function usingData(data, filter='', filterTime=''){

	console.log(data)
	//document.location.reload(false)

	data_principal.innerHTML = ''
	divRow = document.createElement('div')

	divRow.className = 'my-3'
	divDatas = document.createElement('div')
	data_principal.appendChild(divRow)
	divRow.appendChild(divDatas)
	
	let count = 0
	let distance = 0
	let duration = ''
	let durationH = 0
	let durationM = 0
	let durationS = 0
	let durationDays = 0
	let heartRate = 0
	let maxHeartRate = 0
	let speed = 0
	let moving_time = 0
	let paceSeconds = 0
	let paceMinutes = 0

	var today = new Date()

	for(var e = 0; e < data.length; e++){

	

		if(filter != ''){
		if(filter != data[e]['type']){
			continue
		}
		}

		if(filterTime != ''){
			/*
		if(filterTime == 'Today'){
			if (parseInt(data[e]['start_date'].slice(0,4)) != today.getFullYear() || parseInt(data[e]['start_date'].slice(5,7)) != (today.getMonth() + 1) || parseInt(data[e]['start_date'].slice(8,10)) != today.getDate()) {
				continue
			}
			*/
			/*
			
		}
		else if(filterTime == 'ThisMonth'){
			if (parseInt(data[e]['start_date'].slice(0,4)) != today.getFullYear() || parseInt(data[e]['start_date'].slice(5,7)) != (today.getMonth() + 1)) {
				continue
			}
		}

		else if(filterTime == 'ThisYear'){
			if (parseInt(data[e]['start_date'].slice(0,4)) != today.getFullYear() || parseInt(data[e]['start_date'].slice(5,7)) != (today.getMonth() + 1)) {
				continue
			}
		}

		*/


		
		//console.log(data[e]['start_date'].slice(8,10))
		
		if (data[e]['type'] == 'VirtualRide'){
			distanceBike = data[e]['name'].replace('km', '')
			distanceBike = parseFloat(distanceBike.replace(',', '.'))
			distance += distanceBike
		}
		distance += data[e]['distance']/1000
		
		var d = new Date()
		let durationTime = data[e]['moving_time']  
		let durationHour = Math.floor(durationTime / 3600, 2)
		let durationMinutes = Math.floor((durationTime - Math.floor(durationTime / 3600) * 3600) / 60)
		let durationSeconds = durationTime - (durationHour * 3600 + durationMinutes * 60)

		moving_time += data[e]['moving_time']
		
		durationH += durationHour
		durationM += durationMinutes
		durationS += durationSeconds



		heartRate += data[e]['average_heartrate'] * data[e]['moving_time']
		count++

		if (data[e]['max_heartrate'] > maxHeartRate) {
			maxHeartRate = data[e]['max_heartrate']
		}

	}

	while(durationS >=60){
		durationS -= 60
		durationM ++
	}

	while(durationM >= 60){
		durationM -= 60
		durationH ++
	}

	while(durationH >= 24){
		durationH -= 24
		durationDays ++
	}

	if (filter == 'Run'){
		paceSeconds = parseInt(moving_time / distance)

		while(paceSeconds >= 60){
			paceSeconds -= 60
			paceMinutes += 1
		}
	}

	let average_heartrate = heartRate / moving_time
	if(durationDays == 0){
		duration = durationH + ':' + durationM + ':' + durationS
		
	}
	else{
		duration = durationDays + 'day(s)' +  durationH + ':' + durationM + ':' + durationS
	}

	speed = (distance * 1000 / moving_time) * 3.6 
	p0 = document.createElement('p')

	p1 = document.createElement('p')

	p2 = document.createElement('p')

	p3 = document.createElement('p')

	p4 = document.createElement('p')

	p5 = document.createElement('p')

	p6 = document.createElement('p')

	p0.innerHTML = 'Number of activities: <strong>' + count + '</strong>'

	p1.innerHTML = 'Distance: <strong>' + distance.toFixed(2) + ' Km </strong>'

	p2.innerHTML = 'Duration: <strong>' + duration + '</strong>'

	p3.innerHTML = 'Average Heart Rate: <strong>' + average_heartrate.toFixed(1) + '</strong>'

	p4.innerHTML = 'Maximum Heart Rate: <strong>' + maxHeartRate.toFixed(1) + '</strong>'

	p5.innerHTML = 'Average speed: <strong>' + speed.toFixed(2) + ' Km/h<speed>'

	p6.innerHTML = 'Average pace: <strong>' + paceMinutes + ':' + paceSeconds + ' min/Km </strong>'

	divRow.appendChild(p0)

	if(filter == 'Run' || filter == 'Ride' || filter == 'VirtualRide'){

		divRow.appendChild(p1)	
	}
	

	divRow.appendChild(p2)

	if(filter == 'Run' || filter == 'Ride' || filter == 'VirtualRide'){
		divRow.appendChild(p5)	
	}

	if(filter == 'Run'){
		divRow.appendChild(p6)	
	}

	divRow.appendChild(p3)

	divRow.appendChild(p4)
	
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

            client_id: '50023',
            client_secret: 'd0a66b31bdaabc10ea82c9693de38dc30fac5084',
            refresh_token: '1a4c1acd899b892ccb1157c2ca940e3c82b90e85',
            grant_type: 'refresh_token'
        })

    }).then(res => res.json())
    	.then(res => getActivites(res, filter, filterTime))
    
      
}





reAuthorize()