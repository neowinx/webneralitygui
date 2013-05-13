/**
 * Webnerality Main Script
 * @author Pedro Flores
 */

function AppViewModel() {
	self = this;
	
	types = { "boolean" : "boolean", "string" : "string" };
	
	function TipoProyecto(nombre){
		return {
			nombre : nombre
		};
	}
	
	function Framework(tipoProyecto,nombre,variables){
		return {
			tipoProyecto : tipoProyecto,
			nombre : nombre,
			variables : variables
		};
	}
	
	function VariablePlantilla(nombre,tipo,valorPorDefecto,visible){
		return {
			nombre : nombre,
			tipo : tipo,
			valorPorDefecto : valorPorDefecto,
			visible : typeof visible === "undefined" ? true : visible
		}; 
	}
	
    self.tiposDeProyecto = [
    	new TipoProyecto("Web"), 
    	new TipoProyecto("Desktop"), 
    	new TipoProyecto("Mobil")
    ];
    
    self.frameworks = ko.observableArray([
    	new Framework(self.tiposDeProyecto[1], "SWT+JPA+Hibernate",[
    		new VariablePlantilla('projectName',types.string,'proyecto-swt'),
    		new VariablePlantilla('mainPackage',types.string,'py.com.codelab'),
    		new VariablePlantilla('entityPackage',types.string,'py.com.codelab.entities'),
    		new VariablePlantilla('dialogsPackage',types.string,'py.com.codelab.swt.dialog'),
    		new VariablePlantilla('workspaceDir',types.string,'/home/user/ECLIPSE_HOME/WORKSPACES/indigo/proyecto-swt/',false),
    		new VariablePlantilla('applicationTitle',types.string,'SWT Project'),
    		new VariablePlantilla('blankStringsAreNull',types.boolean,true)
    	]),
    	new Framework(self.tiposDeProyecto[0], "Seam 2.0.0 GA", [
    		new VariablePlantilla('nombreProyecto',types.string,'proyecto'),
    		new VariablePlantilla('pathSeparator',types.string,'/'),
    		new VariablePlantilla('mainPackage',types.string,'py.com.codelab'),
    		new VariablePlantilla('warProjectName',types.string,'py.com.codelab.entities')
    	]),
    	new Framework(self.tiposDeProyecto[0], "Symfony"),
    	new Framework(self.tiposDeProyecto[2], "Android"),
    	new Framework(self.tiposDeProyecto[2], "JQueryMobile")
    ]);
    
    self.tipoDeProyecto = ko.observable(self.tiposDeProyecto[0]);
    
	self.framework = ko.observable(self.frameworks[0]);
    
    self.filteredFrameworks = ko.dependentObservable(function() {
    	return ko.utils.arrayFilter(
    		self.frameworks(),
    		function(framework){
    			return framework.tipoProyecto.nombre == self.tipoDeProyecto().nombre; 
    		});
    });

}

ko.applyBindings(new AppViewModel());