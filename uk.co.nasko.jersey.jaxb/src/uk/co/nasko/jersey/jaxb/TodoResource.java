package uk.co.nasko.jersey.jaxb;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

//import uk.co.nasko.jersey.jaxb.model.Todo;
import uk.co.nasko.jersey.jaxb.model.Tag;
@Path("/tag")
public class TodoResource {
  // This method is called if XMLis request
  @POST
  @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
  
  public Tag getXML(
	  @DefaultValue("notext") @FormParam("text") String text,
	  @DefaultValue("semweb") @FormParam("vocab") String vocab) {
  	//String vocab = info.getQueryParameters().getFirst("vocab");
  		Tag todo = new Tag(text,vocab);
	    todo.setSummary("This is my first todo");
	    todo.setDescription("This is my first todo");
	    return todo;
	  }
  
  // This can be used to test the integration with the browser
  @GET
  @Produces({ MediaType.TEXT_XML })
  /*public Tag getHTML() {
	  
    Tag todo = new Tag();
    todo.setSummary("This is my first todo");
    todo.setDescription("This is my first todo");
    return todo;
  }*/
  public Tag getHTML(
		  @DefaultValue("notext") @QueryParam("text") String text,
		  @DefaultValue("semweb") @QueryParam("vocab") String vocab) {
	  	//String vocab = info.getQueryParameters().getFirst("vocab");
	  	Tag todo = new Tag(text,vocab);
	    todo.setSummary("This is my first todo");
	    todo.setDescription("This is my first todo");
	    return todo;
	  }

} 