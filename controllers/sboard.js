class controller{
    static async page(req,res){
        let io = req.app.get("socket");
        io.on("connection",function(socket){
            socket.on("emit",function(data){
                io.emit("emit",data);
            });
            socket.on("timesup",function(data){
                io.emit("timesup",data);
            });
            socket.on("reset",function(data){
                io.emit("reset",data);
            });
        });
        res.render("sboard");
    }

    static async client(req,res){
        res.render("sboard-client");
    }
}

module.exports = controller