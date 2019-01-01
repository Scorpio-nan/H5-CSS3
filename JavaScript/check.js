/*
*
* ���㷨10W�����14���ƺ��Ƽ���ʱ4700���룬�����������10���14���ƣ���ʱ2000���롣
* ����10W�����14���ƺ��Ƽ���Ϊ2700����  cpu5��I7
* ���㷨֧���߶��жϣ�֧����ӣ�֧�������ӣ�֧�ַ���
* �Ƶ�����1-9Ͳ  11-19��  21-29�� 31-37 �����ϣ����������У�������
* �������΢�ţ�17775718902
* 2�����ƹ�˾�����ܼ࣬�к�����ӭɧ�š�
* ���Ⱪ¶�ķ���
* checkHu(arr)����Ƿ����
* canHu(arr)��ʾ�ܺ�ʲô��
* ������ԣ������ܼ��Ƚϼ򵥣�������ɡ�
*
* */
let isQiDui=true; //�Ƿ�Ĭ��֧���߶�
let isLaiZi=true; //�Ƿ������
let laiZi=35; //Ĭ�Ϻ��������
let isFeng=false; //�Ƿ�������
let Check=function () {

};
//�������ڶ�λ������λ������
let getPos=function (pai) {
    let x=parseInt(pai/10);//getType(pai);
    let y=pai%10-1;
    return {x:x,y:y};
};

//��һ��������תΪ��ά����
let transform=function (pais) {
    let result=[
        [0,0,0,0,0,0,0,0,0], //Ͳ
        [0,0,0,0,0,0,0,0,0], //��
        [0,0,0,0,0,0,0,0,0], //��
        [0,0,0,0,0,0,0] //��
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

//��ȡ��ӵĸ���,������֮���Ƴ�ת�����е��������
let getLaiZiCount=function (transformedPais) {
    let pos=getPos(laiZi);
    let count=transformedPais[pos.x][pos.y];
    transformedPais[pos.x][pos.y]=0;
    return count;
};

//��ȡ���п��ܵĽ���λ��
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
    if(transformedPaiArray[i]>=3){//���������һ���ģ�ֱ���Ƴ�
        transformedPaiArray[i]-=3;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    if(transformedPaiArray[i]>0&&transformedPaiArray[i+1]!=undefined&&transformedPaiArray[i+1]>0&&transformedPaiArray[i+2]!=undefined&&transformedPaiArray[i+2]>0){
        transformedPaiArray[i]-=1;
        transformedPaiArray[i+1]-=1;
        transformedPaiArray[i+2]-=1;
        return clearOnePais(transformedPaiArray,maxLaiZi,i,needLaiZi);
    }
    if(transformedPaiArray[i]===2){//���������һ���ģ�ֱ���Ƴ�
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
    //�ȼ���߶�
    if(isQiDui&&pais.length===14&&checkQiDui(transformedPais,laiZiCount)){
        return true;
    }
    let allJiang=getAllJiang(transformedPais);
    //�������һ���������ж�ʣ�µ����ܷ��Ϊ����
    for(let i=0;i<allJiang.length;i++){
        let laiZi=laiZiCount;
        let needLaiZiCount=0;
        let copyedTransformedPais=copyTransformedPais(transformedPais); //����һ����
        if(allJiang[i].length==1){
            laiZi-=1;
        }
        //�Ƴ���ռ�õ���
        for(let j=0;j<allJiang[i].length;j++){
            copyedTransformedPais[allJiang[i][j][0]][[allJiang[i][j][1]]]-=1;
        }

        //����Ͳ�ӣ����ӣ����ӳ�Ϊ������Ҫ����Ӹ���
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

        if(isFeng&&laiZi>=0){ //�����Ҫ���ƣ�����������Ҫ���������
            laiZi-=this.getFengNeedLaiZiCount(copyedTransformedPais[3]);
        }

        if(laiZi>=0){
            return true;
        }
    }
    return false;
};


//��ȡ���Ƴ�Ϊ��������Ҫ���������
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
//��ȡ���ţ�Ͳ�������򣩳�Ϊ������Ҫ��������Щ,������ӵĸ���
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

//�жϵ�ǰ������ʲô��
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