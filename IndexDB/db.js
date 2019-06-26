!(function(){
	var db,
		request,
		objectStore,
		table = 'info'
		
	window.DB = {
		/*  创建数据库，并初始化数据表
		 *	@dbName 	数据库名
		 *  @callback	回调函数
		 */
		create:function(dbName,tableName,callback){
			window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			request = window.indexedDB.open(dbName,2);
			
			table = tableName;

			request.onerror = function(ev){
				callback({
					state:'error',
					message:'数据库连接失败~'
				})
			}
			
			request.onsuccess = function(ev){
				db = request.result;
				callback({
					state:'success',
					tableName:tableName,
					message:'数据库连接成功~，已自动连接数据表 info'
				})
				// var transaction = db.transaction(["info"], "readwrite");
				// objectStore = transaction.objectStore("info");
			}
			
			request.onupgradeneeded = function(ev){
				db = ev.target.result;
				//判断数据表存不存在，如果不存在就创建表
				if(!db.objectStoreNames.contains(tableName)){
					objectStore = db.createObjectStore(tableName, {keyPath: "id",autoIncrement: true});
				}
			}
			return DB;    //让每个数据库操作都可以进行链式调用
		},
		/*	删除数据库
		 *	@dbName 	数据库名
		 *  @callback	回调函数
		 */
		delete:function(dbName,callback){
			try{
				request = indexedDB.deleteDatabase(dbName);
				request.onerror = function(ev){
					callback({
						state:'error',
						message:ev.target
					})
				}
				
				request.onsuccess = function(ev){
					callback({
						state:'success',
						message:'删除成功~'
					})
				}
				
			}catch(e){}
			return DB;
		},
		/*	读取数据库所有数据
		 *	@dbName 	数据库名
		 *  @callback	回调函数
		 */
		readAll:function(dbName,callback){
			if(!DB.isConnect(callback)) return;

			var transaction = db.transaction(dbName,'readwrite');
			var objectStore = transaction.objectStore(dbName);
			var arr = [];
			
			objectStore.openCursor().onsuccess = function(ev){
				var cursor = event.target.result;
				if(cursor){
					arr = cursor.value.value;
					cursor.continue();
				}else{
					callback({
						state:'success',
						message:'查询数据所有成功~',
						data:arr
					})
				}
			}
			objectStore.openCursor().onerror = function(ev){
				callback({
					state:'error',
					message:'(error readAll)发生未知错误~',
					data:ev
				})
			}
			return DB;
		},
		/*	读取数据库第一条数据
		 *	@dbName 	数据库名
		 *  @callback	回调函数
		 */
		readFristIndex:function(dbName,callback){
			if(!DB.isConnect(callback)) return;

			var transaction = db.transaction(dbName);
			var objectStore = transaction.objectStore(dbName);
			var res = objectStore.get(1);
			res.onsuccess = function(ev){
				if(res.result){
					callback({
						state:'success',
						message:'查询数据成功~',
						data:res.result
					})
				}else{
					callback({
						state:'success',
						message:'暂无更多数据~'
					})
				}
			}
			res.onerror = function(ev){
				callback({
					state:'error',
					message:'(error readFristIndex)发生未知错误~',
					data:ev
				})
			}
			return DB;
		},
		/*	通过条件查找数据   IndexDB 主键查询不好用, 这里暂时先一次查所有集合, 然后filter;
		 *	@dbName 	查询的数据表的表名称
		 *	@key        查询的键
		 *  @val        查询的键的键值
		 *  @callback	回调函数
		 */
		findDataCondition:function(dbName,key,val,callback){
			if(!DB.isConnect(callback)) return;

			var transaction = db.transaction(dbName,'readwrite');
			var objectStore = transaction.objectStore(dbName);
			var arr = [];

			objectStore.openCursor().onsuccess = function(ev){
				var cursor = event.target.result;
				if(cursor){
					arr.push(cursor.value);
					cursor.continue();
				}else{
					var temp = [];
					temp = arr.filter(ele => ele[key] == val);
					callback({
						state:'success',
						message:'查询成功~',
						data:temp
					})
				}
			}
			objectStore.openCursor().onerror = function(ev){
				callback({
					state:'error',
					message:'(error findDataCondition)发生未知错误~',
					data:ev
				})
			}
			return DB;
		},
		/*	这个方法和上面的方法差不多, 不过这个方法有点类似 mysql 的like模糊查询;
		 *	@dbName 	查询的数据表的表名称
		 *	@key        查询的键
		 *  @val        查询的键的键值
		 *  @callback	回调函数
		 */
		queryDataLike:function(dbName,key,val,callback){
			if(!DB.isConnect(callback)) return;

			var transaction = db.transaction(dbName,'readwrite');
			var objectStore = transaction.objectStore(dbName);
			var arr = [];

			objectStore.openCursor().onsuccess = function(ev){
				var cursor = event.target.result;
				if(cursor){
					arr.push(cursor.value);
					cursor.continue();
				}else{
					var temp = [];
					temp = arr.filter(ele => ele[key].toString().includes(val));
					callback({
						state:'success',
						message:'查询成功~',
						data:temp
					})
				}
			}
			objectStore.openCursor().onerror = function(ev){
				callback({
					state:'error',
					message:'(error findDataCondition)发生未知错误~',
					data:ev
				})
			}
			return DB;
		},
		/*	插入数据
		 *	@obj 		插入的对象
		 *  @callback	回调函数
		 */
		insert:function(obj,callback){
			if(!DB.isConnect(callback)) return;

			var request = db.transaction([table],"readwrite").objectStore(table).add({id:1,value:obj});
			
			request.onerror = function(ev){
				callback({
					state:'error',
					message:'(error insert)新增数据失败~' + ev.target
				})
			}
			request.onsuccess = function(ev){
				callback({
					state:'success',
					message:'新增数据成功~'
				})
			}
			return DB;
		},
		/*	删除第一条数据
		 *  @callback	回调函数
		 */
		removeFirstIndex:function(callback){
			if(!DB.isConnect(callback)) return;
			var request = db.transaction([table],'readwrite').objectStore(table).delete(1);
			
			request.onsuccess = function(ev){
				callback({
					state:'success',
					message:'成功删除第一条数据~'
				})
			}
			return DB;
		},
		/*	删除所有数据
		 *  @callback	回调函数
		 */
		removeAll:function(callback){
			if(!DB.isConnect(callback)) return;

			var request = db.transaction([table],'readwrite').objectStore(table).clear();
			
			request.onsuccess = function(ev){
				callback({
					state:'success',
					message:'成功删除当前表所有数据~'
				})
			}
			return DB;
		},
		/*	更新数据
		 *	@obj 		更新的对象
		 *  @callback	回调函数
		 */
		update:function(obj,callback){
			if(!DB.isConnect(callback)) return;

			var request = db.transaction([table], 'readwrite').objectStore(table).put({id:1,value:obj});
			
			request.onsuccess = function(ev){
				callback({
					state:'success',
					message:'数据更新成功~'
				})
			}
			
			request.onerror = function(ev){
				callback({
					state:'error',
					message:'(error update)数据更新失败~' + ev.target
				})
			}
			return DB;
		},
		/*	关闭数据库连接
		 *  @callback	回调函数
		 */
		close:function(callback){
			if(!DB.isConnect(callback)) return;

			var request = db.close();
			callback({
				state:'success',
				message:'数据库已断开连接~'
			})
			return DB;
		},
		/*
		 * write操作，先会查找数据库面有没有数据集合,如果有的话就执行 update,没有的话就执行 insert
		 * @tableName  数据表表名
		 * @callback   调用成功的回调
		 * @obj		   需要插入的数据
		 */
		write:function(obj,callback){

			if(!DB.isConnect(callback)) return;
			var request = db.transaction(table,'readwrite').objectStore(table);
			var arr = [];
			request.openCursor().onsuccess = function(){
				var cursor = event.target.result;
				if(cursor){
					arr = cursor.value.value;
					cursor.continue();
				}else{
					if(arr.length > 0){
						DB.update(obj,callback);
					}else{
						DB.insert(obj,callback);
					}
				}
			}

			request.openCursor().onerror = function(ev){
				callback({
					state:'error',
					message:'(error readAll)发生未知错误~',
					data:ev
				})
			}
			return DB;
		},
		/*
		 * 根据用户ID去删除数据库里面的指定用户或群组
		 * @groupid   群组ID
		 * @callback  回调成功之后的处理
		 */
		removeById:function(groupid,callback){
			if(!DB.isConnect(callback)) return;

			var request = db.transaction(table,'readwrite').objectStore(table);
			var arr = [],id= null;
			request.openCursor().onsuccess = function(){
				var cursor = event.target.result;
				if(cursor){
					arr = cursor.value.value;
					cursor.continue();
				}else{
					var temp = arr.filter(ele => ele.id != groupid);
					DB.write(temp,callback);
				}
			}

			request.openCursor().onerror = function(ev){
				callback({
					state:'error',
					message:'(error readAll)发生未知错误~',
					data:ev
				})
			}

		},
		/*
		 * 此方法为往数据表里面添加一条数据,原有的insert不满足业务需求，重新扩展一个add
		 * @tableName 表名:要往哪里添加
		 * @obj  	  object对象,加入到群组列表里面去的
		 * @callback  成功之后的回调
		 */
		insertTo(tableName,obj,callback){
			if(!DB.isConnect(callback)) return;

			var request = db.transaction(table,'readwrite').objectStore(table);
			var arr = [],id= null;
			request.openCursor().onsuccess = function(){
				var cursor = event.target.result;
				if(cursor){
					arr = cursor.value.value;
					cursor.continue();
				}else{
					var temp = arr.push(obj);
					DB.write(temp,callback);
				}
			}

			request.openCursor().onerror = function(ev){
				callback({
					state:'error',
					message:'(error readAll)发生未知错误~',
					data:ev
				})
			}
		}
	}
	// vue 里面直接写  __proto__ 会报错,换成 defineProperty 就OK了
	Object.defineProperty(DB,'isConnect',{
		value:function(callback){
			if(!db){
				callback({
					state:'error',
					message:'(error database is not connect)请先打开数据库~'
				})
				return false;
			}
			return true;
		},
		configurable: true,
		enumerable: false,
		writable: true
	})
	/* DB.__proto__.isConnect = function(callback){
		if(!db){
			callback({
				state:'error',
				message:'(error database is not connect)请先打开数据库~'
			})
			return false;
		}
		return true;
	} */
}())