Template['user'].helpers({
});

Template['user'].events({
});

Template['user'].rendered=function(){
    // this.data == vendor object returned in parent helper
    console.log(this.data);
};