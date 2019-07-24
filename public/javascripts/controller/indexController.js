app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    
    $scope.messages = [];
    $scope.players = {};

    $scope.init = ()=>{
        const username = prompt('please enter username');

        if (username)
            initSocket(username);
        else
            return false;
    };

    function scrollTop() {
		setTimeout(() => {
			const element = document.getElementById('chat-area');
			element.scrollTop = element.scrollHeight;
		});
    }
    
    function showBubble(id, message) {
		$('#'+ id).find('.message').show().html(message);

		setTimeout(() => {
			$('#'+ id).find('.message').hide();
        },2000);
        
	}


    function initSocket(username){

        indexFactory.connectSocket('http://localhost:3000')
        .then((socket)=>{
            //console.log('bağlantı gerçekleşti', socket);
            socket.emit('newUser',{username});

            socket.on('initPlayers',(players)=>{
                $scope.players = players
                $scope.$apply();
            })

            socket.on('newUser',(data)=>{
                
                const messageData = {
                    type:{
                        code:0,
                        message:1
                    },//info
                    username:data.username
                };

                $scope.messages.push(messageData);//arraye gönderme
                $scope.players[data.id] =data;
                $scope.$apply();
                console.log(data);
            });

            socket.on('disUser', (data) => {
				const messageData = {
					type: {
						code: 0,
						message: 0
					}, // info
					username: data.username
				};

                $scope.messages.push(messageData);
                delete $scope.players[data.id];
				$scope.$apply();
			});
           
            socket.on('animate', data => {
				$('#'+ data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
					animate = false;
				});
            });

            socket.on('newMessage',(data)=>{

                $scope.messages.push(data);
                $scope.$apply();
                showBubble(data.socketId,data.text);
                scrollTop();
            });
            
            let animate = false;
            $scope.onClickPlayer = ($event) => {
				if (!animate){
					let x = $event.offsetX;
					let y = $event.offsetY;

					socket.emit('animate', { x, y });

					animate = true;
					$('#'+ socket.id).animate({ 'left': x, 'top': y }, () => {
						animate = false;
					});
				}
			};

            $scope.newMessage = ()=>{

                let message = $scope.message;
               
                const messageData = {
                    type:{
                        code:1,
                    },//info
                    username:username,
                    text:message
                };

                $scope.messages.push(messageData);//arraye gönderme
                $scope.message = '';

                socket.emit('newMessage', messageData);

                showBubble(socket.id,message);
                scrollTop();

             
            }

          

        }).catch((err)=>{
            console.log(err);
        });
        
        //const socket = io.connect('http://localhost:3000');

    };

   

}]);