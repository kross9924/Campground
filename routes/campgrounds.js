var express= require("express");
var router=express.Router();

var Campground=require("../models/campgrounds");
var middleware=require("../middleware");
// SCHEMA SETUP!!

/*Campground.create(
	{
		name:"balyan baba",
		image:"https://q-xx.bstatic.com/xdata/images/hotel/840x460/196377895.jpg?k=50abd15a8d47232fc79dddebe6b56249e2abd55844165a5e0d47cb4b1d3ab925&o=",
		description:"this is balyans place .stay away if you don't wanna be dead!!"
	},function(err,campground){
		if(err){
			console.log(err);
		}else{
			console.log("Newly created campground: ");
			console.log(campground);
		}
	}
)*/



    
router.get("/",function(req,res){
        Campground.find({},function(err,allcampgrounds){
            if(err){
                console.log(err);
            
            }else{
                res.render("campgrounds/index",{campgrounds:allcampgrounds});
                
            }
        })
    
    
    });
    
router.post("/",middleware.isLoggedIn,function(req,res){
        var name=req.body.name;
        var price=req.body.price;
        var image=req.body.image;
        var desc=req.body.description;
        var author= {
            id:req.user._id,
            username:req.user.username
        }
        var newCampground = {name: name,price:price, image: image, description: desc,author:author}
        // create a new campground and save to db
    
        Campground.create(newCampground,function(err,newlyCreated){
            if(err){
                console.log(err);
            }else{
                res.redirect("/campgrounds");}
        });
    
    });
    //NEW -show form to create new campground
    router.get("/new",middleware.isLoggedIn,function(req,res){
     res.render("campgrounds/news.ejs");
    });
    
    router.get("/:id", function(req,res){
        Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
            if(err){
                console.log(err);
    
         }else{
             console.log(foundCampground);
            res.render("campgrounds/show" ,{campground: foundCampground});
         }
        });
    });
        
// Edit Campground Route 
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err, foundCampground){
          res.render("campgrounds/edit",{campground: foundCampground});
           });
    });
         



// Update Campground Route

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
//find and update the correct campground

Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
        res.redirect("/campgrounds");
    }else{
        //redirect somewhere(show page)
        res.redirect("/campgrounds/" + req.params.id);
    }
});

});

//Destroy Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});

    //MiddleWare-seperate directory

   
    module.exports = router;