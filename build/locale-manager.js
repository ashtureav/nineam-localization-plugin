Ext.define("nineam.localization.model.ClientModel-Touch",{extend:"Ext.data.Model",config:{fields:[{name:"client",type:"object"},{name:"method",type:"string"},{name:"key",type:"string"}]}});Ext.define("nineam.localization.model.ClientModel-ExtJS",{extend:"Ext.data.Model",fields:[{name:"client",type:"object"},{name:"method",type:"string"},{name:"key",type:"string"}]});Ext.define("nineam.localization.model.ClientModel",{extend:Ext.getVersion("extjs")?"nineam.localization.model.ClientModel-ExtJS":"nineam.localization.model.ClientModel-Touch"});Ext.define("nineam.localization.model.LocaleModel-Touch",{extend:"Ext.data.Model",config:{fields:[{name:"id",type:"string"},{name:"label",type:"string"},{name:"url",type:"string"},{name:"propertiesClass",type:"string"}]}});Ext.define("nineam.localization.model.LocaleModel-ExtJS",{extend:"Ext.data.Model",fields:[{name:"id",type:"string"},{name:"label",type:"string"},{name:"url",type:"string"},{name:"frameworkUrl",type:"string"},{name:"propertiesClass",type:"object"}]});Ext.define("nineam.localization.model.LocaleModel",{extend:Ext.getVersion("extjs")?"nineam.localization.model.LocaleModel-ExtJS":"nineam.localization.model.LocaleModel-Touch"});Ext.define("nineam.localization.store.LocalesStore-Touch",{extend:"Ext.data.Store",requires:["nineam.localization.model.LocaleModel"],config:{storeId:"localesStore",model:"nineam.localization.model.LocaleModel",proxy:{type:"memory",reader:{type:"json",root:""}}}});Ext.define("nineam.localization.store.LocalesStore-ExtJS",{extend:"Ext.data.Store",requires:["nineam.localization.model.LocaleModel"],storeId:"localesStore",model:"nineam.localization.model.LocaleModel",proxy:{type:"memory",reader:{type:"json",root:""}}});Ext.define("nineam.localization.store.LocalesStore",{extend:Ext.getVersion("extjs")?"nineam.localization.store.LocalesStore-ExtJS":"nineam.localization.store.LocalesStore-Touch"});Ext.define("nineam.localization.controls.Date",{override:"Ext.picker.Date",renderTpl:['<div id="{id}-innerEl" role="grid">','<div role="presentation" class="{baseCls}-header">','<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>','<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>','<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',"</div>",'<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">','<thead role="presentation"><tr role="presentation">','<tpl for="dayNames">','<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',"</tpl>","</tr></thead>",'<tbody role="presentation"><tr role="presentation">','<tpl for="days">',"{#:this.isEndOfWeek}",'<td role="gridcell" id="{[Ext.id()]}">','<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">','<em role="presentation"><span role="presentation"></span></em>',"</a>","</td>","</tpl>","</tr></tbody>","</table>",'<tpl if="showToday">','<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',"</tpl>","</div>",{firstInitial:function(a){return Ext.picker.Date.prototype.getDayInitial(a)},isEndOfWeek:function(b){b--;var a=b%7===0&&b!==0;return a?'</tr><tr role="row">':""},renderTodayBtn:function(a,b){Ext.DomHelper.generateMarkup(a.$comp.todayBtn.getRenderTree(),b)},renderMonthBtn:function(a,b){Ext.DomHelper.generateMarkup(a.$comp.monthBtn.getRenderTree(),b)}}],refresh:function(){var a=Ext.Date.format(new Date(),this.format);if(this.showToday){this.todayBtn.setText(Ext.String.format(this.todayText,a));this.todayBtn.setTooltip(Ext.String.format(this.todayTip,a))}this.monthBtn.setTooltip(this.monthYearText);this.update(this.activeDate,true);this.innerEl.dom.title=Ext.String.format(this.ariaTitle,Ext.Date.format(this.activeDate,this.ariaTitleDateFormat));this.prevEl.dom.title=this.prevText;this.nextEl.dom.title=this.nextText;this.picker=null;this.hideMonthPicker(true)}});Ext.define("nineam.localization.delegate.LocaleDelegate",{requires:["Ext.Ajax"],success:{},failure:{},scope:"",constructor:function(c,a,b){this.callParent(arguments);this.success=c;this.failure=a;this.scope=b},loadPropertiesFile:function(a){if(!this.success||!this.scope){return}Ext.Ajax.request({url:a,success:this.ajaxSuccess,failure:this.ajaxFailure,scope:this})},ajaxSuccess:function(a){this.success.call(this.scope,a.responseText)},ajaxFailure:function(){}});Ext.define("nineam.localization.event.LocaleEvent",{statics:{INITIALIZED:"nineam.localization.event.LocaleEvent.INITIALIZED",LOCALES_CHANGED:"nineam.localization.event.LocaleEvent.LOCALES_CHANGED",LOCALE_CHANGED:"nineam.localization.event.LocaleEvent.LOCALE_CHANGED"}});Ext.define("nineam.localization.LocaleManager",{singleton:true,requires:["nineam.localization.event.LocaleEvent","nineam.localization.delegate.LocaleDelegate"],mixins:{observable:"Ext.util.Observable"},initialized:false,clients:[],locales:null,getLocales:function(){return this.locales},setLocales:function(a){this.locales=a;this.fireEvent(nineam.localization.event.LocaleEvent.LOCALES_CHANGED,{})},locale:null,getLocale:function(){return this.locale},setLocale:function(a){this.locale=a;this.loadPropertiesFile()},properties:null,getProperties:function(){return this.properties},getPersistedLocale:function(){return"en_us"},constructor:function(a){Ext.log({level:"log"},"DEBUG: Constructing LocaleManager");this.callParent(arguments);this.mixins.observable.constructor.call(this,a)},loadPropertiesFile:function(){var c=this.locales.findRecord("id",this.locale);var b=new nineam.localization.delegate.LocaleDelegate(this.loadPropertiesFileResultHandler,this.loadPropertiesFileFaultHandler,this);var a=c.get("url");Ext.log({level:"log"},"DEBUG: LocaleManager - Loading properties file: "+a);b.loadPropertiesFile(a)},loadPropertiesFileResultHandler:function(a){Ext.log({level:"log"},"DEBUG: LocaleManager - Properties file loaded: "+this.locales.findRecord("id",this.locale).get("url"));var c=document.getElementsByTagName("head")[0];var b=document.createElement("script");b.type="text/javascript";b.innerHTML=a;c.appendChild(b);var d=this;setTimeout(function(){var e=d.locales.findRecord("id",d.locale);d.properties=Ext.create(e.get("propertiesClass"));d.updateClients();d.fireEvent(nineam.localization.event.LocaleEvent.LOCALE_CHANGED,{});if(!d.initialized){Ext.log({level:"log"},"DEBUG: LocaleManager - Locale Manager Initialized");d.initialized=true;d.fireEvent(nineam.localization.event.LocaleEvent.INITIALIZED,{})}},100)},loadPropertiesFileFaultHandler:function(){Ext.log({level:"error"},"ERROR: LocaleManager - Failure loading properties file")},updateClients:function(){Ext.log({level:"log"},"DEBUG: LocaleManager - Updating Clients");var a=this.clients.length-1;for(var b=a;b>-1;b--){this.updateClient(this.clients[b])}},updateClient:function(clientModel){var client=clientModel.get("client");var method=clientModel.get("method");var key=clientModel.get("key");try{var prop;if(key){var global=eval("this.properties."+key);prop=global?global:eval("client."+key)}else{prop=this.properties}client[method].call(client,prop)}catch(e){Ext.log({level:"error"},"ERROR: LocaleManager - Error updating client [client: "+client.getId()+", method: "+method+", key: "+key+"] - error: "+e)}},registerClient:function(a){Ext.log({level:"log"},"DEBUG: LocaleManager - Registering client component [client: "+a.get("client").getId()+", method: "+a.get("method")+", key: "+a.get("key")+"]");this.clients.push(a);if(this.properties){this.updateClient(a)}}});Ext.define("nineam.localization.LocalePlugin",{extend:Ext.getVersion("extjs")?"Ext.AbstractPlugin":"Ext.Component",alias:"plugin.localization",required:["nineam.localization.LocaleManager","nineam.localization.model.ClientModel"],config:{method:"",key:""},init:function(b){var a=Ext.create("nineam.localization.model.ClientModel",{client:b,method:this.getMethod(),key:this.getKey()});nineam.localization.LocaleManager.registerClient(a)}});