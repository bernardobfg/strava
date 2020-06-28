
auth_link = "https://www.strava.com/oauth/token"

//criando o mapa
//queria q o filtro da pagina funcionasse para atualizar o mapa, mas aparece um erro q n consegui solucionar
function usingMap(data, filter='', filterTime=''){
	//console.log(filter, filterTime)

	
	var mapa = document.getElementById('mapa')
	

	var map = new L.map('mapa').setView([-22.964377,-43.2037587], 11);
	console.log(map)
	


            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            for(var x=0; x<data.length; x++){

        		if (filter!='') {
        			console.log('OI')
        		}
        		

            	if (data[x].map.summary_polyline) {
            		var cor
	            	//console.log(data[x].map.summary_polyline)
	                var coordinates = L.Polyline.fromEncoded(data[x].map.summary_polyline).getLatLngs()

	               	
	                //console.log(coordinates)
	                //para diferencias as atividades, se for corrida terá a cor vermelha, se for pedal, verde
	                if (data[x]['type'] == 'Run') {
	                	//console.log(data[x]['type'])
	                	cor = 'red'

	                }
	                else if(data[x]['type'] == 'Ride'){
	                	//console.log(data[x]['type'])
	                	cor = 'green'
	                }
                	
            	}

            	L.polyline(

                    coordinates,
                    {
                        color:cor,
                        weight:.5,
                        opacity:.7,
                        lineJoin:'round'
                    }

                ).addTo(map)
                
            }


}


//usando os dados
function usingData(data, filter='', filterTime=''){


	console.log(data)
	//document.location.reload(false)

	divDatas.innerHTML = ''
	if (filter=='') {
		header.innerHTML ='All activities'
	}
	else{
		header.innerHTML = filter
	}
	
	
	
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
	var activityId = 0

//itera sobre cada atividade
	for(var e = 0; e < data.length; e++){

	data[e]['activityId'] = activityId

	activityId ++
//aplicando o filtro
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

		
		//console.log(data[e]['start_date'].slice(8,10))

		// caso seja corrida, pedal ou pedal virtual, teremos distancia e velocidade
		// caso seja VirtualRide, coloco no nome da atividade a distancia percorrida 


		if (data[e]['type'] == 'VirtualRide' && data[e]['name'].toLowerCase().indexOf('km') != -1){
			distanceBike = data[e]['name'].toLowerCase().replace('km', '')
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
//frequencia cardiaca maxima
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

	//caso seja corrida, calcula o pace
	if (filter == 'Run'){
		paceSeconds = parseInt(moving_time / distance)

		while(paceSeconds >= 60){
			paceSeconds -= 60
			paceMinutes += 1
		}
	}
	//calcula a média de batimentos
	let average_heartrate = heartRate / moving_time
	if(durationDays == 0){
		duration = durationH + ':' + durationM + ':' + durationS
		
	}
	else{
		duration = durationDays + 'day(s)' +  durationH + ':' + durationM + ':' + durationS
	}

	speed = (distance * 1000 / moving_time) * 3.6 

	//cria os paragrafos onde vao ficar os atributos
	p0 = document.createElement('p')
	p0.className = 'card-text'

	p1 = document.createElement('p')
	p1.className = 'card-text'

	p2 = document.createElement('p')
	p2.className = 'card-text'

	p3 = document.createElement('p')
	p3.className = 'card-text'

	p4 = document.createElement('p')
	p4.className = 'card-text'

	p5 = document.createElement('p')
	p5.className = 'card-text'

	p6 = document.createElement('p')
	p6.className = 'card-text'

	p0.innerHTML = 'Number of activities: <strong>' + count + '</strong>'

	p1.innerHTML = 'Distance: <strong>' + distance.toFixed(2) + ' Km </strong>'

	p2.innerHTML = 'Duration: <strong>' + duration + '</strong>'

	p3.innerHTML = 'Average Heart Rate: <strong>' + average_heartrate.toFixed(1) + '</strong>'

	p4.innerHTML = 'Maximum Heart Rate: <strong>' + maxHeartRate.toFixed(1) + '</strong>'

	p5.innerHTML = 'Average speed: <strong>' + speed.toFixed(2) + ' Km/h<speed>'

	p6.innerHTML = 'Average pace: <strong>' + paceMinutes + ':' + paceSeconds + ' min/Km </strong>'

	divDatas.appendChild(p0)

	

	divDatas.appendChild(p1)	
	
	

	divDatas.appendChild(p2)

	if(filter == 'Run' || filter == 'Ride' || filter == 'VirtualRide'){
		divDatas.appendChild(p5)	
	}

	if(filter == 'Run'){
		divDatas.appendChild(p6)	
	}

	divDatas.appendChild(p3)

	divDatas.appendChild(p4)

//divMap.innerHTML = ''
	//map = document.createElement('div')
	//divMap.appendChild(map)
//funcao para usar o mapa
usingMap(data,filter, filterTime)
	
}






//usando o acsess_token para obter os dados
function getActivites(res, filter='', filterTime = ''){
	//console.log(res.access_token)
	let filter1 = filter
	let filter2 = filterTime
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`
    fetch(activities_link)
        .then((res) => res.json())
        .then((data) => usingData(data, filter1, filter2))
     
        
}



//O codigo de acesso expira a cada 6 horas, essa parte atualiza sempre esse codigo
//substituir os x's pelo seu id_client, client_secret(obtidos no strava), e o refresh token obtido no postman 
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












