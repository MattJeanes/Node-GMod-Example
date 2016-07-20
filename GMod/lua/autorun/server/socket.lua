-- Socket

require( "bromsock" )

Socket = Socket or {}

if Socket.Socket then
	Socket.Socket:Close()
	print("Closed socket")
end

-- Node address
Socket.Node = {
	address = "127.0.0.1",
	port = 8080
}

Socket.Handlers=Socket.Handlers or {}

function Socket:Init(port)
	local sock=BromSock()
	if sock:Listen(port) then
		print("Listening on port "..port)
		sock:SetCallbackAccept(function(...) self:Listen(...) end)
		sock:Accept()
		self.Socket = sock
	else
		print("Failed to bind port "..port)
	end
	hook.Call("Socket-SocketReady", GAMEMODE)
end

function Socket:Listen(serversock,clientsock)
	clientsock:SetCallbackReceive(function(...) self:Receive(...) end) -- Start accepting requests
	clientsock:SetTimeout(15000)
	clientsock:Receive()
	serversock:Accept()
end

function Socket:Receive(sock,packet)
	local handle=packet:ReadString()
	print("Received handle " .. handle)
	local handler=self.Handlers[handle]
	if handler then
		handler(sock,packet)
	end
	sock:Close()
	sock:Receive()
end

function Socket:AddHandler(handle,func)
	if handle and func and type(handle)=="string" and type(func)=="function" then
		self.Handlers[handle]=func
		return true
	else
		return false
	end
end

function Socket:SendToNode(handle,func)
	local web=self.Node
	if web then
		self:Send(handle,func,web.address,web.port)
		return true
	else
		return false
	end
end

function Socket:Send(handle,func,address,port)
	local packet=BromPacket()
	packet:WriteString(handle)
	if func then
		func(packet)
	end
	local sock=BromSock()
	sock:SetCallbackConnect(function(sock,ret,ip,port)
		sock:Send(packet:Copy())
		sock:Close()
	end)
	sock:Connect(address,port)
end

Socket:Init(13375) -- listen port

Socket:AddHandler("echo", function(sock,packet)
	local str=packet:ReadString()
	print("Recieved echo: " .. str)
	Socket:SendToNode("echo",function(packet)
		packet:WriteString(str)
	end)
end)

function Socket:Test(message)
	Socket:SendToNode("test",function(packet)
		packet:WriteString(message)
	end)
end