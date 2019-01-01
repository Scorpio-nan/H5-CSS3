/*
*
* 本算法10W次随机14张牌胡牌检测耗时4700毫秒，其中随机生成10万次14张牌，耗时2000毫秒。
* 所以10W次随机14张牌胡牌计算为2700毫秒  cpu5代I7
* 本算法支持七对判断，支持癞子，支持随机癞子，支持风牌
* 牌的数字1-9筒  11-19条  21-29万 31-37 东，南，西，北，中，发，白
* 交流请加微信：17775718902
* 2年棋牌公司技术总监，有合作欢迎骚扰。
* 对外暴露的方法
* checkHu(arr)检测是否胡牌
* canHu(arr)提示能胡什么牌
* 其他如吃，碰，杠检测比较简单，自行完成。
*
* */
let isQiDui=true; //是否默认支持七对
let isLaiZi=true; //是否有癞子
let laiZi=35; //默认红中是癞子
let isFeng=false; //是否开启风牌
let Check=function () {

};
//返回牌在二位数组中位置坐标
let getPos=function (pai) {
    let x=parseInt(pai/10);//getType(pai);
    let y=pai%10-1;
    return {x:x,y:y};
};

//将一个牌数组转为二维数组
let transform=function (pais) {
    let result=[
        [0,0,0,0,0,0,0,0,0], //筒
        [0,0,0,0,0,0,0,0,0], //条
        [0,0,0,0,0,0,0,0,0], //万
        [0,0,0,0,0,0,0] //风
    ];
    for(let i=pais.length-1;i>=0;i--){
        let pos=getPos(pais[i]);
        result[pos.x][pos.y]+=1;
    }
    return result;
};

let copyTransformedPais=function (transformedPais) {
    let result=[];
    for(let i=0;i<transformedPais.length;i++){
        result.push([].concat(transformedPais[i]));
    }
    return result;
};

//获取癞子的个数,并且在之后移除转换牌中的所有癞子
let getLaiZiCount=function (transformedPais) {
    let pos=getPos(laiZi);
    let count=transformedPais[pos.x][pos.y];
    transformedPais[pos.x][pos.y]=0;
    return count;
};

//获取所有可能的将的位置
let getAllJiang=function (transformedPais) {
    let result=[];
    for(let i=0;i<transformedPais.length;i++){
        for(let j=0;j<transformedPais[i].length;j++){
            if(transformedPais[i][j]>0){
                result.push(transformedPais[i][j]===1?[[i,j]]:[[i,j],[i,j]]);
            }
        }
    }
    result.sort((a,b)=>{
       return a.length-b.length;
    });
    return result;
};

let checkQiDui=function (transformedPais,laiZiCount) {
    let duiZi=0;
    for(let i=0;i<transformedPais.length;i++){
        for(let j=0;j<transformedPais[i].length;j++){
            if(transformedPais[i][j]<2)
                continue;
            switch(transformedPais[i][j]){
                case 2:
                    duiZi+=1;
                    break;
                case 3:
                    duiZi+=1;
                    break;
                case 4:
                    duiZi+=2;
                    break;
            }
        }
    }
    return laiZiCount>6-duiZi;
};

let clearOnePais=function (transformedPaiArray,maxLaiZi,i,needLaiZi) {
    if(transformedPaiArray[i]===0||needLaiZi.n>maxLaiZi){
        return;
    }
    if(transformedPaiArray[i]>=3){//如果是三个一样的，直接移除
        transformedPaiArray[i]-=3;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    if(transformedPaiArray[i]>0&&transformedPaiArray[i+1]!=undefined&&transformedPaiArray[i+1]>0&&transformedPaiArray[i+2]!=undefined&&transformedPaiArray[i+2]>0){
        transformedPaiArray[i]-=1;
        transformedPaiArray[i+1]-=1;
        transformedPaiArray[i+2]-=1;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    if(transformedPaiArray[i]===2){//如果是三个一样的，直接移除
        transformedPaiArray[i]-=2;
        needLaiZi.n+=1;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    if(transformedPaiArray[i]>0&&transformedPaiArray[i+1]!=undefined&&transformedPaiArray[i+1]>0){
        transformedPaiArray[i]-=1;
        transformedPaiArray[i+1]-=1;
        needLaiZi.n+=1;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }

    if(transformedPaiArray[i]>0&&transformedPaiArray[i+2]!=undefined&&transformedPaiArray[i+2]>0){
        transformedPaiArray[i]-=1;
        transformedPaiArray[i+2]-=1;
        needLaiZi.n+=1;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    transformedPaiArray[i]-=1;
    needLaiZi.n+=2;
};

let pro=Check.prototype;

pro.setIsQiDui=function (temp) {
    isQiDui=temp;
};

pro.checkHu=function(pais){
    let transformedPais=transform(pais);
    let laiZiCount=isLaiZi?getLaiZiCount(transformedPais):0;
    if(laiZiCount===4){
        return true;
    }
    if(laiZiCount===1&&pais.length==2){
        return true;
    }
    //先检测七对
    if(isQiDui&&pais.length===14&&checkQiDui(transformedPais,laiZiCount)){
        return true;
    }
    let allJiang=getAllJiang(transformedPais);
    //随机拿走一对做将，判断剩下的牌能否成为整扑
    for(let i=0;i<allJiang.length;i++){
        let laiZi=laiZiCount;
        let needLaiZiCount=0;
        let copyedTransformedPais=copyTransformedPais(transformedPais); //复制一份牌
        if(allJiang[i].length==1){
            laiZi-=1;
        }
        //移除将占用的牌
        for(let j=0;j<allJiang[i].length;j++){
            copyedTransformedPais[allJiang[i][j][0]][[allJiang[i][j][1]]]-=1;
        }

        //计算筒子，条子，万子成为整朴需要的癞子个数
        for(let j=0;j<3;j++){
            let reversePais=[].concat(copyedTransformedPais[j]);
            let oneNeedLaiZiCount=this.getNeedLaiZiCount(copyedTransformedPais[j],laiZi);
            if(oneNeedLaiZiCount>0){
                let oneNeedLaiZiCountReverse=this.getNeedLaiZiCount(reversePais.reverse(),laiZi);
                if(oneNeedLaiZiCount>oneNeedLaiZiCountReverse){
                    oneNeedLaiZiCount=oneNeedLaiZiCountReverse;
                }
            }
            laiZi-=oneNeedLaiZiCount;
            if(laiZi<0){
                break;
            }
        }

        if(isFeng&&laiZi>=0){ //如果需要风牌，则加入风牌需要的癞子数量
            laiZi-=this.getFengNeedLaiZiCount(copyedTransformedPais[3]);
        }

        if(laiZi>=0){
            return true;
        }
    }
    return false;
};


//获取风牌成为整扑所需要的癞子数量
pro.getFengNeedLaiZiCount=function (transformedPaiArray) {
    let needLaiZiCount=0;
    for(let i=0;i<transformedPaiArray.length;i++){
        if(transformedPaiArray[i]===0||transformedPaiArray[i]===3){
            continue;
        }
        if(transformedPaiArray[i]==2){
            needLaiZiCount+=1;
        }else{
            needLaiZiCount+=2;
        }
    }
    return needLaiZiCount;
}
//获取单门（筒，条，万）成为整扑需要的牌有哪些,所需癞子的个数
pro.getNeedLaiZiCount=function (transformedPaiArray,maxLaiZi) {
    let needLaiZi={n:0};
    for(let i=0;i<transformedPaiArray.length;i++){
        if(transformedPaiArray[i]===0){
            continue;
        }
        clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    return needLaiZi.n;
};

//判断当前牌型听什么牌
pro.canHu=function(arr){
    let result=[];
    let majhongs=[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29];
    if(isFeng){
        majhongs=majhongs.concat([31,32,33,34,35,36,37]);
    }else if(isLaiZi&&laiZi>30){
        majhongs.push(laiZi);
    }
    for(let i=0;i<majhongs.length;i++){
        if(this.checkHu([].concat(arr,majhongs[i]))){
            result.push(majhongs[i]);
        }
    }
    return result;
};



module.exports=Check;