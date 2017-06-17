/**
 * Created by jansi on 07/06/17.
 */


$("#project").change(function() {

    var input = this.value;
    console.log(input);
    $("." + input).remove();

});


