angular.module('zmwFilter',[])
    .filter('goodTypeFilter',function(){
       return function(data,parent){
           var filterData=[];
           angular.forEach(data,function(obj){
                if(obj.parentId===parent){
                    filterData.push(obj);
                }
           })
           return filterData;
       }
    });

