var axios=require('axios');
var scrapper=require('cheerio');
var express=require("express");
var cors = require('cors')

var app=express();
app.use(cors())

app.get('/ranking',function(request,response){
  var rankingList=[];
  axios.get('https://codeforces.com/ratings').then(res=>{
    var data=scrapper.load(res.data);
    data('.ratingsDatatable').find('tr').each(function(ind,val){
      if(ind>0){
        var entry=scrapper(val)
        var item=[]
        entry.find('td').each(function(ind1,val1){
          var entry1=scrapper(val1)
          if(ind1==1)
            item.push(entry1.text().replace(/(\r\n|\n|\r)/gm, "").trim())
          else
            item.push(parseInt(entry1.text().replace(/(\r\n|\n|\r)/gm, "").trim()))
        })
        rankingList.push(item)
      }
    });
    response.send({
      "status":"done",
      "data":rankingList
    })
  }).catch(err=>{
    console.log(err);
    response.send({
      "status":"error"
    })
  });
});

app.get('/country',function(request,response){
  var countryList=[];
  axios.get('https://codeforces.com/ratings').then(res=>{
    var data=scrapper.load(res.data);
    data('[name=countryName]').find('option').each(function(ind,val){
      if(ind>0){
        var entry=scrapper(val);
        var dataString=entry.text().split(',');
        var country=[
          dataString[0].replace(/(\r\n|\n|\r)/gm, "").trim(),
          parseInt(dataString[1].replace(/(\r\n|\n|\r)/gm, "").trim())
        ]
        countryList.push(country)
      }
    })
    response.send({
      "status":"done",
      "data":countryList
    })
  }).catch(err=>{
    console.log(err);
    response.send({
      "status":"error"
    })
  });
});

app.listen(2020,function(){
  console.log("Started on PORT 2020");
})
