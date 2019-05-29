String.prototype.padLeft = function (length, character) {
    return new Array(length - this.length + 1).join(character || ' ') + this;
};

Reddcoin.helpers = {
    formatDay: function(d){
        var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

        var curr_date = d.getDate();
        var curr_month = d.getMonth();

        return m_names[curr_month] + " " + curr_date;
    },

    formatTime: function(d){
        var ret = this.formatDay(d) + ' ';
            ret += d.getHours().toString().padLeft(2, '0') + ':'
            ret += d.getMinutes().toString().padLeft(2, '0');
            
        return ret;
    },

    numberWithCommas: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
