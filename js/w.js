/**
 * Webnerality Main Script
 * @author Pedro Flores
 */

function AppViewModel() {
	self = this;
	
	function TipoProyecto(nombre){
		return {
			nombre : nombre
		};
	}
	
	function Framework(tipoProyecto,nombre){
		return {
			tipoProyecto : tipoProyecto,
			nombre : nombre
		};
	}
	
    self.tiposDeProyecto = [
    	new TipoProyecto("Web"), 
    	new TipoProyecto("Desktop"), 
    	new TipoProyecto("Mobil")
    ];
    
    self.frameworks = ko.observableArray([
    	new Framework(self.tiposDeProyecto[1], "SWT+JPA+Hibernate"),
    	new Framework(self.tiposDeProyecto[0], "Seam 2.0.0 GA"),
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