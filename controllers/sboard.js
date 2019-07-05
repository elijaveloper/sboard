class controller{
    static async page(req,res){
        let io = req.app.get("socket");
        io.on("connection",function(socket){
            console.log(socket.id + " has connected.");
            socket.on("emit",function(data){
                io.emit("emit",data);
            });
        });
        res.render("sboard");
    }

    static async client(req,res){
        res.render("sboard-client");
    }
}

module.exports = controller