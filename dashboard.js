'use strict';
angular.module('urbanApp').controller('dashboardCtrl', function($scope, $http, $interval, COLORS, $cookies, $state) {
  var s = $scope;

  if ($cookies.get('fab_customer')) {

  } else {
    $state.go('user.signin');
  }

  //sorting
  s.sortType = 'employee';
  s.sortReverse = false;

  s.sortTypeAdv = 'employee';
  s.sortReverseAdv = false;

  s.sortTypeWalk = 'employee';
  s.sortReverseWalk = false;

  s.sortTypeTricks = 'employee';
  s.sortReverseTricks = false;

  s.sortTypeEmpSales = 'employee';
  s.sortReverseEmpSales = false;

  s.sortTypeSalesByType = 'label';
  s.sortReverseSalesByType = false;

  s.odIndvAdv = function(e) {
    return (e.adv_bookings_value / s.gross_sales.adv_bookings_value) * 100 || 0;
  }

  s.averageSaleAdv = function(e) {
    return e.adv_bookings_value / e.adv_bookings || 0;
  }

  s.averageSale = function(e) {
    return e.sales_total / e.orders || 0;
  }

  s.ausAdv = function(e) {
    return e.adv_bookings_units / e.adv_bookings || 0;
  }

  s.aus = function(e) {
    return e.items_sold / e.orders || 0;
  }

  s.odIndvWalkins = function(e) {
    return (e.walkins_value / s.gross_sales.walkins_value) * 100 || 0;
  }

  s.averageSaleWalkin = function(e) {
    return e.walkins_value / e.walkins || 0;
  }

  s.ausWalkin = function(e) {
    return e.walkins_units / e.walkins || 0;
  }

  s.odIndvTricks = function(e) {
    return (e.quick_tricks_value / s.gross_sales.quick_tricks_value) * 100 || 0;
  }

  s.averageSaleTricks = function(e) {
    return e.quick_tricks_value / e.quick_tricks || 0;
  }

  s.ausTricks = function(e) {
    return e.quick_tricks_units / e.quick_tricks || 0;
  }


  var visits = [
    [3, 8],
    [4, 1],
    [5, 1],
    [6, 6],
    [7, 4],
    [8, 3],
    [9, 9],
    [10, 7],
    [11, 1]
  ];

  Date.prototype.ddmmyyyy = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
  };
  var dtin = new Date();
  //   var rightNow = new Date();
  //   s.datetoday = rightNow.toISOString().slice(0,10);
  //   s.datetoday = rightNow.toISOString().slice(0,10).replace(/-/g,"/");
  //   s.datetoday = dtin.ddmmyyyy();
  if (localStorage.getItem("datetoday") !== null) {
    s.datetoday = new Date(localStorage.getItem("datetoday"));
  } else {
    s.datetoday = new Date();
    localStorage.setItem("datetoday", s.datetoday);
  }

  if (localStorage.getItem("datetoday2") !== null) {
    s.datetoday2 = new Date(localStorage.getItem("datetoday2"));

  } else {
    s.datetoday2 = new Date();
    localStorage.setItem("datetoday2", s.datetoday2);
  }

  s.rangestart = dtin.ddmmyyyy();
  s.rangeend = moment();
  s.daterangesettings = {
    format: 'YYYY-MM-DD',
    startDate: s.rangestart,
    endDate: s.rangeend
  };
  s.daterange = '';

  s.datePicker = {
    date: {
      startDate: moment(),
      endDate: moment()
    }
  };

  s.updatecnt = {
    total_records: 10,
    total_processed: 10,
    total_updated: 10,
    total_added: 10
  }
  s.getdata = function() {
    //    console.log(s.datetoday);
    s.updateorders();
  }
  s.showloaded = 0;
  $scope.pieDataset = [{
    label: 'Total Record',
    data: s.updatecnt.total_records,
    color: COLORS.danger
  }, {
    label: 'Processed',
    data: s.updatecnt.total_processed,
    color: COLORS.info
  }, {
    label: 'Updated',
    data: s.updatecnt.total_updated,
    color: COLORS.warning
  }, {
    label: 'New',
    data: s.updatecnt.total_added,
    color: COLORS.success
  }];
  $scope.pieDataOrders = [{
    label: 'Unpaid',
    data: 1,
    color: COLORS.danger
  }, {
    label: 'Paid',
    data: 1,
    color: COLORS.info
  }, {
    label: 'Held',
    data: 1,
    color: COLORS.warning
  }];

  s.getdataSoft = function() {
    s.showloaded = 0;
    s.total_orders = 0;
    s.total_unpaid = 0;
    s.total_unpaid_val = 0;
    s.total_paid = 0;
    s.total_paid_val = 0;
    s.total_discounted = 0;
    s.total_discounted_val = 0;
    s.trans_type = [{
      id: 0,
      label: 'No services',
      qty_closed: 0,
      qty_closed_val: 0,
      qty_open: 0,
      qty_open_val: 0,
      data: 0,
      qty_total_val: 0,
      color: COLORS.danger
    }, {
      id: 1,
      label: 'Quick Tricks',
      qty_closed: 0,
      qty_closed_val: 0,
      qty_open: 0,
      qty_open_val: 0,
      data: 0,
      qty_total_val: 0,
      color: COLORS.bodyBg
    }, {
      id: 2,
      label: 'Walk in service',
      qty_closed: 0,
      qty_closed_val: 0,
      qty_open: 0,
      qty_open_val: 0,
      data: 0,
      qty_total_val: 0,
      color: COLORS.info
    }, {
      id: 3,
      label: 'Advance Service Booking',
      qty_closed: 0,
      qty_closed_val: 0,
      qty_open: 0,
      qty_open_val: 0,
      data: 0,
      qty_total_val: 0,
      color: COLORS.warning
    }, {
      id: 4,
      label: 'Web Order',
      qty_closed: 0,
      qty_closed_val: 0,
      qty_open: 0,
      qty_open_val: 0,
      data: 0,
      qty_total_val: 0,
      color: COLORS.success
    }, {
      id: 5,
      label: 'Other',
      qty_closed: 0,
      qty_closed_val: 0,
      qty_open: 0,
      qty_open_val: 0,
      data: 0,
      qty_total_val: 0,
      color: COLORS.dark
    }];


    s.employees = [];
    s.getemployees();

    s.gross_sales.paid = 0;
    s.gross_sales.unpaid = 0;
    s.gross_sales.excluded = 0;
    s.gross_sales.items_sold = 0;
    s.gross_sales.sold_total = 0;
    s.gross_sales.sold_total_discount = 0;
    s.gross_sales.sold_total_discount_count = 0;
    s.gross_sales.excluded_orders = [];
    s.gross_sales.employee_orders = [];
    s.gross_sales.employee_orders_cnt = 0;
    s.gross_sales.employee_orders_items = 0;
    s.gross_sales.employee_orders_totals = 0;
    s.gross_sales.magic_skin = 0;
    s.gross_sales.magic_skin_count = 0;
    s.gross_sales.adv_bookings_units = 0;
    s.gross_sales.adv_bookings_value = 0;
    s.gross_sales.walkins_units = 0;
    s.gross_sales.walkins_value = 0;
    s.gross_sales.quick_tricks_units = 0;
    s.gross_sales.quick_tricks_value = 0;
    s.gross_sales.looks_sold = 0;
    s.gross_sales.sets_sold = 0;


  }




  s.updateorders = function() {
    s.showloaded = 0;
    //  console.log();
    s.total_orders = 0;
    s.total_unpaid = 0;
    s.total_unpaid_val = 0;
    s.total_paid = 0;
    s.total_paid_val = 0;
    s.total_discounted = 0;
    s.total_discounted_val = 0;
    s.employees = [];
    var usedate1 = s.datetoday.toISOString().slice(0, 10);
    var usedate2 = s.datetoday.toISOString().slice(0, 10);
    var uri = '/api/importOrderQ/?created_date__gte=' + usedate1 + 'T00:00:01&created_date__lte=' + usedate2 + 'T23:59:59&limit=0';
    $http.get(uri).success(function(json) {
      s.updatecnt.total_records = json.total_records;
      s.updatecnt.total_processed = json.total_processed;
      s.updatecnt.total_updated = json.total_updated;
      s.updatecnt.total_added = json.total_added;
      $scope.pieDataset = [{
        label: 'Total Records',
        data: s.updatecnt.total_records,
        color: COLORS.danger
      }, {
        label: 'Processed',
        data: s.updatecnt.total_processed,
        color: COLORS.info
      }, {
        label: 'Updated',
        data: s.updatecnt.total_updated,
        color: COLORS.warning
      }, {
        label: 'New',
        data: s.updatecnt.total_added,
        color: COLORS.success
      }];
      s.showloaded = 1;
      s.updateorderitems();
      s.getemployees();
    });

  }



  s.updateorderitems = function() {
    var usedate1 = s.datetoday.toISOString().slice(0, 10);
    var usedate2 = s.datetoday.toISOString().slice(0, 10);
    var uri = '/api/importOrderItemQ/?created_date__gte=' + usedate1 + 'T00:00:01&created_date__lte=' + usedate2 + 'T23:59:59&limit=0';
    $http.get(uri).success(function(json) {
      // console.log('Items imported');
    });
  }


  s.employees = [];
  s.getemployees = function() {
    s.employees = [];
    $http.get('/api/getusers/').success(function(json) {

      //console.log(json);

      for (var i = 0; i < json.length; i++) {
        var eo = {
          id: json[i].id,
          resource_uri: json[i].resource_uri,
          user: json[i].user,
          first_name: json[i].first_name,
          last_name: json[i].last_name,
          full_name: json[i].first_name + ' ' + json[i].last_name,
          email: json[i].email,
          orders_open: 0,
          orders_open_val: 0,
          orders_closed: 0,
          orders_closed_val: 0,
          orders_com: 0,
          orders_com_val: 0
        }
        s.employees.push(eo);
      }
      s.getordersfromdb();
      //      s.getorderitems();
    });
  }



  s.getemployees();
  s.total_orders = 0;
  s.total_unpaid = 0;
  s.total_unpaid_val = 0;
  s.total_paid = 0;
  s.total_paid_val = 0;
  s.total_discounted = 0;
  s.total_discounted_val = 0;
  s.userlist = [];
  s.trans_type = [{
    id: 0,
    label: 'No services',
    qty_closed: 0,
    qty_closed_val: 0,
    qty_open: 0,
    qty_open_val: 0,
    data: 0,
    qty_total_val: 0,
    color: COLORS.danger
  }, {
    id: 1,
    label: 'Quick Tricks',
    qty_closed: 0,
    qty_closed_val: 0,
    qty_open: 0,
    qty_open_val: 0,
    data: 0,
    qty_total_val: 0,
    color: COLORS.bodyBg
  }, {
    id: 2,
    label: 'Walk in service',
    qty_closed: 0,
    qty_closed_val: 0,
    qty_open: 0,
    qty_open_val: 0,
    data: 0,
    qty_total_val: 0,
    color: COLORS.info
  }, {
    id: 3,
    label: 'Advance Service Booking',
    qty_closed: 0,
    qty_closed_val: 0,
    qty_open: 0,
    qty_open_val: 0,
    data: 0,
    qty_total_val: 0,
    color: COLORS.warning
  }, {
    id: 4,
    label: 'Web Order',
    qty_closed: 0,
    qty_closed_val: 0,
    qty_open: 0,
    qty_open_val: 0,
    data: 0,
    qty_total_val: 0,
    color: COLORS.success
  }, {
    id: 5,
    label: 'Other',
    qty_closed: 0,
    qty_closed_val: 0,
    qty_open: 0,
    qty_open_val: 0,
    data: 0,
    qty_total_val: 0,
    color: COLORS.dark
  }];
  s.data_orders = [];
  s.data_items = [];
  s.data_items_payments = [];
  s.data_total_payments = 0;
  s.data_total_payments_refund = 0;
  s.data_total_payments_amount = 0;
  s.data_total_payments_refund_amount = 0;
  s.data_items_cnt = 0;
  s.data_items_value = 0;
  s.data_items_voided = 0;
  s.data_items_voided_value = 0;
  s.getordersfromdb = function() {

    s.data_orders = [];
    s.data_orders_clean = [];
    s.data_items = [];
    s.data_items_payments = [];
    s.data_total_payments = 0;
    s.data_total_payments_refund = 0;
    s.data_total_payments_amount = 0;
    s.data_total_payments_refund_amount = 0;

    // items
    s.data_items_cnt = 0;
    s.data_items_value = 0;
    s.data_items_voided = 0;
    s.data_items_voided_value = 0;
    s.data_items_excluded = 0;
    s.data_items_excluded_value = 0;

    s.data_product_list_pre = [];
    s.data_product_list = [];

    // /api/getorderbydate/:date
    //    console.log(s.datetoday2);
    //s.datetoday2 = s.datetoday;
    localStorage.setItem("datetoday", s.datetoday);
    localStorage.setItem("datetoday2", s.datetoday2);

    console.log(s.datetoday);
    console.log(moment(s.datetoday).add(0, 'days').toJSON().slice(0, 10));
    console.log(moment(s.datetoday2).add(0, 'days').toJSON().slice(0, 10));

    var usedate1 = moment(s.datetoday).add(0, 'days').toISOString().slice(0, 10);
    var usedate2 = moment(s.datetoday2).add(0, 'days').toISOString().slice(0, 10);

    console.log(usedate2);

    $http.get('/api/getorderbydates/' + usedate1 + '/' + usedate2).success(function(indata) {
      s.gtotal = 0;

      var json = indata.orders;
      s.data_orders = indata.orders;
      s.data_items = indata.items;
      s.data_payments = indata.summary[0].payments;
      s.summary = indata.summary[0];
      console.log(s.summary);
      s.summary.total_skus;
      s.summary.refunds_count;
      s.summary.refunds_total;
      s.summary.total_discounts;
      s.summary.voided_items;
      s.summary.gift_total;
      s.summary.total_payments;
      s.graph_data = [];
      s.lineOptions.yaxis.max = 0;

      for (var i = 0; i < s.summary.graph_data.length; i++) {

        var inarr = s.summary.graph_data[i];
        if (s.lineOptions.yaxis.max < inarr[1]) { s.lineOptions.yaxis.max = inarr[1]; }
        s.graph_data.push([i, inarr[1]]);
      }

      $scope.lineDataset = [{
        data: s.graph_data,
        color: COLORS.success
      }];


      // process products
      for (var i = 0; i < s.data_items.length; i++) {
        var index = $scope.data_product_list_pre.indexOf(s.data_items[i].product_name_override);
        if (index == -1) {
          s.data_product_list_pre.push(s.data_items[i].product_name_override);
        }
        s.data_product_list_pre.sort();

      }



      for (var i = 0; i < s.data_product_list_pre.length; i++) {

        var initem = { product_name: s.data_product_list_pre[i], cnt: 0, val: 0, vcnt: 0, vval: 0 };
        s.data_product_list.push(initem);
      }

      s.units_sold = 0;

      // Process payments
      for (var p = 0; p < s.data_payments.length; p++) {

        if (s.data_payments[p].transaction_status == 'Unknown') {
          console.log('unknown');
        } else {

          if (s.data_payments[p].amount < 0) { // refunds
            s.data_total_payments_refund += 1;
            s.data_total_payments_refund_amount += (s.data_payments[p].amount * 1);
            s.data_total_payments -= 1;
            s.data_total_payments_amount += (s.data_payments[p].amount * 1);
          } else {
            var payorder = "/resources/Order/" + s.data_payments[p].order_no + "/";
            s.data_orders_clean.push(payorder);

            s.data_total_payments += 1;
            s.data_total_payments_amount += (s.data_payments[p].amount * 1);

            // process items
            for (var i = 0; i < s.data_items.length; i++) {

              if (s.data_items[i].order == payorder) {
                var addto = '';
                if (s.data_items[i].ervc_type == 0 || s.data_items[i].ervc_type == 1) {

                  s.data_items_cnt += s.data_items[i].quantity * 1;
                  s.data_items_value += (s.data_items[i].price * s.data_items[i].quantity);
                  if (s.data_items[i].product_name_override === 'INSTANT MAKEUP MAGIC - HOUSE' || s.data_items[i].product_name_override === 'INSTANT MAKEUP MAGIC - LEAD' || s.data_items[i].product_name_override === 'EXPRT ARTSTRY MADE EASY - HSE' || s.data_items[i].product_name_override === 'EXPRT ARTSTRY MADE EASY - LD' || s.data_items[i].product_name_override === 'LOOKS MAKEOVER - HOUSE' || s.data_items[i].product_name_override === 'LOOKS MAKEOVER - LEAD' || s.data_items[i].product_name_override === 'MAKEUP WARDROBING - LEAD' || s.data_items[i].product_name_override === 'RED CARPET SECRETS - LEAD' || s.data_items[i].product_name_override === 'BRIDAL TUTORIAL - LEAD' || s.data_items[i].product_name_override === 'COMPLMTRY MAKEUP SESSN') {
                    s.data_items_excluded += s.data_items[i].quantity * 1;
                    s.data_items_excluded_value += (s.data_items[i].price * s.data_items[i].quantity);

                  } else {

                    s.data_items[i].quantity;
                    s.units_sold += s.data_items[i].quantity;

                  }

                }


                if (s.data_items[i].ervc_type == 3 || s.data_items[i].ervc_type == 5) { // voided
                  s.data_items_voided += 1;
                  s.data_items_voided_value += (s.data_payments[p].amount * 1);

                }

                if (s.data_items[i].is_look == true) {
                  //s.gross_sales.employee_orders[useemp].looks_sold += 1;
                  s.gross_sales.looks_sold += 1;
                }


              }
            } // s.data_items.length end

          } // refunds end
        }

      } // payments end



      //console.log(s.data_product_list);

      s.combinedata.process();

      s.total_skus = indata.total_skus;
      s.total_orders = json.length;
      s.footfallConversion = s.total_orders / s.footfall * 100;

      for (var i = 0; i < json.length; i++) {
        var call_name = json[i].call_name;
        var closed = json[i].closed;
        var created_at = json[i].created_at;
        var created_by = json[i].created_by;
        var final_total = json[i].final_total;
        var is_unpaid = json[i].is_unpaid;
        var discount_amount = json[i].discount_amount;
        var dining_option = json[i].dining_option;


        if (is_unpaid) {
          s.total_unpaid += 1;
        }
        else {
          s.total_paid += 1;
        }

        // discounted orders
        if (discount_amount > 0) {
          s.total_discounted += 1;
          s.total_discounted_val += discount_amount;
        };
        // transaction types
        for (var t = 0; t < s.trans_type.length; t++) {
          if (dining_option == s.trans_type[t].id) {
            if (is_unpaid == true) {
              s.trans_type[t].qty_open += 1;
              s.trans_type[t].qty_open_val += final_total;
            }
            if (is_unpaid == false) {
              s.trans_type[t].qty_closed += 1;
              s.trans_type[t].qty_closed_val += final_total;
            }
            s.trans_type[t].data += 1;
            s.trans_type[t].qty_total_val += final_total;
          }
        };

        // staff sales
        if (call_name == '') { // till checkout with no artist
          for (var j = 0; j < s.employees.length; j++) {
            var user = s.employees[j].user;
            if (user == created_by) {
              if (is_unpaid == true) {
                s.employees[j].orders_open += 1;
                s.employees[j].orders_open_val += final_total;
              }
              if (is_unpaid == false) {
                s.employees[j].orders_closed += 1;
                s.employees[j].orders_closed_val += final_total;
                s.gtotal += final_total;
              }
            }
          }
        } else { // checkout with artist
          for (var k = 0; k < s.employees.length; k++) {
            if (s.employees[k].full_name == call_name) {
              var user = s.employees[k].user;
              if (is_unpaid == true) {
                s.employees[k].orders_open += 1;
                s.employees[k].orders_open_val += final_total;
              }
              if (is_unpaid == false) {
                s.employees[k].orders_closed += 1;
                s.employees[k].orders_closed_val += final_total;
                s.gtotal += final_total;
              }
            }
          }
        }

      }

      // oder pie
      $scope.pieDataOrders = [{
        label: 'Unpaid',
        data: s.total_unpaid,
        color: COLORS.danger
      }, {
        label: 'Paid',
        data: s.total_paid,
        color: COLORS.info
      }];
    });

  }



  s.combinedata = {
    process: function() { // s.combinedata.process()
      var newemarr = [];
      for (var o = 0; o < s.data_orders.length; o++) {
        // items
        if (typeof s.data_orders[o].items === 'undefined') {
          s.data_orders[o].items = [];
        }
        for (var i = 0; i < s.data_items.length; i++) {
          if (s.data_items[i].order == s.data_orders[o].resource_uri) {
            s.data_orders[o].items.push(s.data_items[i]);
          }
        }
        // employees
        for (var u = 0; u < s.employees.length; u++) {
          if (s.employees[u].resource_uri == s.data_orders[o].updated_by) {
            s.data_orders[o].employee_name = s.employees[u].full_name;
          }
        }
        if (s.data_orders[o].call_name == '') {
          newemarr.push(s.data_orders[o].employee_name);
          s.data_orders[o].employee_use = s.data_orders[o].employee_name;
        } else {
          newemarr.push(s.data_orders[o].call_name);
          s.data_orders[o].employee_use = s.data_orders[o].call_name;
        }

      };
      var result = [];
      $.each(newemarr, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      result.sort();
      $.each(result, function(i, e) {
        // if (e !== 'undefined') {
        //  s.gross_sales.employee_orders.push({employee: e, orders: 0, items_sold: 0, sales_total: 0 });
        // }

        s.gross_sales.employee_orders.push({
          employee: e,
          orders: 0,
          items_sold: 0,
          items_refunded: 0,
          sales_total: 0,
          looks_sold: 0,
          sets_sold: 0,
          adv_bookings: 0,
          adv_bookings_units: 0,
          adv_bookings_value: 0,
          walkins: 0,
          walkins_units: 0,
          walkins_value: 0,
          quick_tricks: 0,
          quick_tricks_units: 0,
          quick_tricks_value: 0,
          data_capture_count: 0,
          data_capture_per: 0,
          orders_held: 0,
        });

      });

      s.gross_sales.process();
    }
  }

  s.gross_sales = {
    paid: 0, // s.gross_sales.paid
    unpaid: 0,
    excluded: 0,
    items_sold: 0, // s.gross_sales.items_sold
    items_refunded: 0,
    sold_total: 0,
    sold_total_discount: 0,
    sold_total_discount_count: 0,
    excluded_orders: [],
    employee_orders: [],
    employee_orders_cnt: 0,
    employee_orders_items: 0,
    employee_orders_totals: 0,
    magic_skin: 0,
    magic_skin_count: 0,
    adv_bookings_units: 0,
    adv_bookings_value: 0,
    walkins_units: 0,
    walkins_value: 0,
    quick_tricks_units: 0,
    quick_tricks_value: 0,
    looks_sold: 0,
    sets_sold: 0,
    process: function() {


      s.magicSkinCount = 0;
      s.magicCreamCount = 0;
      s.glowingLook = 0;
      s.lashBundle = 0;
      s.magicSum = 0;
      s.magicPrice = 0;
      s.dataObject = [];
      s.result = s.summary.total_payments - s.summary.gift_total;

      var product_combos = {};


      for (var o = 0; o < s.data_orders.length; o++) {


        s.dataObject = s.data_orders[o];

        var index = s.data_orders_clean.indexOf(s.data_orders[o].resource_uri);
        if (index == -1) {


        } else {
          var useemp = -1;
          $.each(s.gross_sales.employee_orders, function(i, e) {
            if (e.employee == s.data_orders[o].employee_use) {
              useemp = i;
              // console.log("Emplpoyee Name");
              // console.log(e.employee);
            }
          });


          //held orders
          if (s.data_orders[o].closed == false) {
            s.gross_sales.employee_orders[useemp].orders_held += 1;
          }

          s.gross_sales.employee_orders[useemp].orders += 1;
          s.gross_sales.employee_orders_cnt += 1;
          var contains_magic = 0;
          var contains_magic_val = 0;
          var contains_magic_cream = 0;
          var contains_glowing_look = 0;
          var contains_lush_bundle = 0;
          var units = 0;
          var total = 0;

          if (!product_combos[s.data_orders[o].resource_uri]) {
            product_combos[s.data_orders[o].resource_uri] = {
              "magicSkin": {
                "SMSTX50XXR10": { "exists": false, "price": 0 },
                "SPRMX40XXR22": { "exists": false, "price": 0 },
                "SCLAX75XXR22": { "exists": false, "price": 0 }
              },
              "magicCream": {
                "SMSTX50XXR10": { "exists": false, "price": 0 },
                "SMECX15XXR10": { "exists": false, "price": 0 },
                "SMNCX50XXR10": { "exists": false, "price": 0 }
              },
              "glowingLook": {
                "EMASXX8X1R22": { "exists": false, "price": 0 },
                "FILPXX6X1R22": { "exists": false, "price": 0 },
                "LLIN12DX2R22": { "exists": false, "price": 0 },
                "LSTK35DX4R22": { "exists": false, "price": 0 }
              },
              "lashBundle": {
                "EMASXX8X1R22": { "exists": false, "price": 0 },
                "EMLLXX8X1R22": { "exists": false, "price": 0 }
              }
            };
          }

          s.data_orders.resource_uri = 0;

          for (var i = 0; i < s.data_orders[o].items.length; i++) {

            if (s.data_orders[o].items[i].exclude_report == false) {

              if (s.data_orders[o].items[i].ervc_type == 0) { //  ||s.data_orders[o].items[i].ervc_type == 1
                if (s.data_orders[o].items[i].sku === 'GIFT_CARD' || s.data_orders[o].items[i].product_name_override === 'INSTANT MAKEUP MAGIC - HOUSE' || s.data_orders[o].items[i].product_name_override === 'INSTANT MAKEUP MAGIC - LEAD' || s.data_orders[o].items[i].product_name_override === 'EXPRT ARTSTRY MADE EASY - HSE' || s.data_orders[o].items[i].product_name_override === 'EXPRT ARTSTRY MADE EASY - LD' || s.data_orders[o].items[i].product_name_override === 'LOOKS MAKEOVER - HOUSE' || s.data_orders[o].items[i].product_name_override === 'LOOKS MAKEOVER - LEAD' || s.data_orders[o].items[i].product_name_override === 'MAKEUP WARDROBING - LEAD' || s.data_orders[o].items[i].product_name_override === 'RED CARPET SECRETS - LEAD' || s.data_orders[o].items[i].product_name_override === 'BRIDAL TUTORIAL - LEAD' || s.data_orders[o].items[i].product_name_override === 'COMPLMTRY MAKEUP SESSN') {

                } else {
                  units += s.data_orders[o].items[i].quantity * 1;

                  s.gross_sales.items_sold += s.data_orders[o].items[i].quantity * 1;
                  // s.gross_sales.items_sold += s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].units_per_set;
                  // console.log(s.data_orders[o].items[i].units_per_set)
                  total += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);


                  s.gross_sales.sold_total += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);

                  //remove prepaid  bookings
                  //console.log(s.data_orders[o].items[i].product_name_override, s.data_orders[o].items[i].sku);

                  if (["SMSTX50XXR10", "SPRMX40XXR22", "SCLAX75XXR22"].indexOf(s.data_orders[o].items[i].sku) > -1) {
                    //product_combos[s.data_orders[o].resource_uri]['magicSkin'][s.data_orders[o].items[i].sku] = true;
                    //magicSkin[s.data_orders[o].items[i].sku] = true;
                    product_combos[s.data_orders[o].resource_uri]['magicSkin'][s.data_orders[o].items[i].sku]['exists'] = true;
                    product_combos[s.data_orders[o].resource_uri]['magicSkin'][s.data_orders[o].items[i].sku]['price'] = s.data_orders[o].items[i].price;

                  }

                  //Magic cream
                  if (["SMSTX50XXR10", "SMECX15XXR10", "SMNCX50XXR10"].indexOf(s.data_orders[o].items[i].sku) > -1) {
                    //product_combos[s.data_orders[o].resource_uri]['magicCream'][s.data_orders[o].items[i].sku] = true;
                    //magicCream[s.data_orders[o].items[i].sku] = true;
                    product_combos[s.data_orders[o].resource_uri]['magicCream'][s.data_orders[o].items[i].sku]['exists'] = true;
                    product_combos[s.data_orders[o].resource_uri]['magicCream'][s.data_orders[o].items[i].sku]['price'] = s.data_orders[o].items[i].price;
                  }

                  //Glowing look
                  if (["EMASXX8X1R22", "FILPXX6X1R22", "LLIN12DX2R22", "LSTK35DX4R22"].indexOf(s.data_orders[o].items[i].sku) > -1) {
                    //product_combos[s.data_orders[o].resource_uri]['glowingLook'][s.data_orders[o].items[i].sku] = true;
                    //magicCream[s.data_orders[o].items[i].sku] = true;
                    product_combos[s.data_orders[o].resource_uri]['glowingLook'][s.data_orders[o].items[i].sku]['exists'] = true;
                    product_combos[s.data_orders[o].resource_uri]['glowingLook'][s.data_orders[o].items[i].sku]['price'] = s.data_orders[o].items[i].price;
                  }

                  //Lash Bundle
                  if (["EMASXX8X1R22", "EMLLXX8X1R22"].indexOf(s.data_orders[o].items[i].sku) > -1) {
                    //product_combos[s.data_orders[o].resource_uri]['lashBundle'][s.data_orders[o].items[i].sku] = true;
                    //magicCream[s.data_orders[o].items[i].sku] = true;
                    product_combos[s.data_orders[o].resource_uri]['lashBundle'][s.data_orders[o].items[i].sku]['exists'] = true;
                    product_combos[s.data_orders[o].resource_uri]['lashBundle'][s.data_orders[o].items[i].sku]['price'] = s.data_orders[o].items[i].price;

                  }

                  s.gross_sales.employee_orders[useemp].items_sold += s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].units_per_set;

                  s.gross_sales.employee_orders[useemp].sales_total += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);
                  s.gross_sales.employee_orders_items += s.data_orders[o].items[i].quantity * 1;
                  s.gross_sales.employee_orders_totals += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);
                  console.log("----------------------");
                  console.log(s.gross_sales.employee_orders_totals);  

                  // adv_bookings
                  if (s.data_orders[o].dining_option == 3) {
                    s.gross_sales.employee_orders[useemp].adv_bookings_units += s.data_orders[o].items[i].quantity * 1;

                    s.gross_sales.employee_orders[useemp].adv_bookings_value += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);

                    s.gross_sales.adv_bookings_units += s.data_orders[o].items[i].quantity * 1;
                    s.gross_sales.adv_bookings_value += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);
                  }

                  // walkins
                  if (s.data_orders[o].dining_option == 2) {
                    s.gross_sales.employee_orders[useemp].walkins_units += s.data_orders[o].items[i].quantity * 1;
                    s.gross_sales.employee_orders[useemp].walkins_value += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);

                    s.gross_sales.walkins_units += s.data_orders[o].items[i].quantity * 1;
                    s.gross_sales.walkins_value += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);
                  }
                  // quick_tricks
                  if (s.data_orders[o].dining_option == 1) {
                    s.gross_sales.employee_orders[useemp].quick_tricks_units += s.data_orders[o].items[i].quantity * 1;
                    s.gross_sales.employee_orders[useemp].quick_tricks_value += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);

                    s.gross_sales.quick_tricks_units += s.data_orders[o].items[i].quantity * 1;
                    s.gross_sales.quick_tricks_value += (s.data_orders[o].items[i].quantity * s.data_orders[o].items[i].price);
                  }


                  //looks sold

                  if (s.data_orders[o].items[i].is_look == true) {
                    s.gross_sales.employee_orders[useemp].looks_sold += 1;
                    s.gross_sales.looks_sold += 1;
                  }


                  //sets sold
                  if (s.data_orders[o].items[i].is_set == true) {
                    s.gross_sales.employee_orders[useemp].sets_sold += 1;
                    s.gross_sales.sets_sold += 1;
                  }
                }


              }


            }
          }; // items end


          if (contains_magic == 3) {
            s.gross_sales.magic_skin += contains_magic_val;
            s.gross_sales.magic_skin_count += 1;
          }


          var discount = s.data_orders[o].discount_amount * 1;
          s.gross_sales.sold_total_discount += discount;
          if (discount !== 0) {
            s.gross_sales.sold_total_discount_count += 1;
          }

          // adv_bookings
          if (s.data_orders[o].dining_option == 3) {
            s.gross_sales.employee_orders[useemp].adv_bookings += 1;
          }

          // walkins
          if (s.data_orders[o].dining_option == 2) {
            s.gross_sales.employee_orders[useemp].walkins += 1;
          }
          // quick_tricks
          if (s.data_orders[o].dining_option == 1) {
            s.gross_sales.employee_orders[useemp].quick_tricks += 1;
          }
        }

      }

      //console.log('PRODUCT COMBOS');
      //console.log(product_combos);

      angular.forEach(product_combos, function(val, key) {
        //console.log('key');
        //console.log(key);
        //console.log('value');
        //console.log(val);
        //console.log(val['glowingLook']);
        if (val.magicSkin.SMSTX50XXR10.exists && val.magicSkin.SPRMX40XXR22.exists && val.magicSkin.SCLAX75XXR22.exists) {
          s.magicSkinCount += 1;
          //console.log("SKU Magic skin");
          //console.log(s.data_items[i].sku);
          s.magicSum += 1;
          var magicSkinPrice1 = val.magicSkin.SMSTX50XXR10.price;
          var magicSkinPrice2 = val.magicSkin.SPRMX40XXR22.price;
          var magicSkinPrice3 = val.magicSkin.SCLAX75XXR22.price;

          var magicSkin1 = !isNaN(parseFloat(magicSkinPrice1)) && isFinite(magicSkinPrice1) ? Number(magicSkinPrice1) : 0;
          var magicSkin2 = !isNaN(parseFloat(magicSkinPrice2)) && isFinite(magicSkinPrice2) ? Number(magicSkinPrice2) : 0;
          var magicSkin3 = !isNaN(parseFloat(magicSkinPrice3)) && isFinite(magicSkinPrice3) ? Number(magicSkinPrice3) : 0;

          s.magicPrice += magicSkin1 + magicSkin2 + magicSkin3;
        }

        //Magic Cream counter
        if (val.magicCream.SMSTX50XXR10.exists && val.magicCream.SMECX15XXR10.exists && val.magicCream.SMNCX50XXR10.exists) {
          s.magicCreamCount += 1;
          var magicCreamPrice1 = val.magicCream.SMSTX50XXR10.price;
          var magicCreamPrice2 = val.magicCream.SMECX15XXR10.price;
          var magicCreamPrice3 = val.magicCream.SMNCX50XXR10.price;

          var magicCream1 = !isNaN(parseFloat(magicCreamPrice1)) && isFinite(magicCreamPrice1) ? Number(magicCreamPrice1) : 0;
          var magicCream2 = !isNaN(parseFloat(magicCreamPrice2)) && isFinite(magicCreamPrice2) ? Number(magicCreamPrice2) : 0;
          var magicCream3 = !isNaN(parseFloat(magicCreamPrice3)) && isFinite(magicCreamPrice3) ? Number(magicCreamPrice3) : 0;

          console.log('MAtch CREAM');
          console.log(key);
          console.log(val);
          //  console.log("SKU Cream");
          // console.log(s.data_items[i].sku);
          s.magicSum += 1;
          s.magicPrice += magicCream1 + magicCream2 + magicCream3;
        }

        //Glowing look
        if (val.glowingLook.EMASXX8X1R22.exists && val.glowingLook.FILPXX6X1R22.exists && val.glowingLook.LLIN12DX2R22.exists && key.glowingLook.LSTK35DX4R22.exists) {
          s.glowingLook += 1;
          var GlowingLookPrice1 = val.glowingLook.EMASXX8X1R22.price;
          var GlowingLookPrice2 = val.glowingLook.FILPXX6X1R22.price;
          var GlowingLookPrice3 = val.glowingLook.LLIN12DX2R22.price;

          var magicGlowLook1 = !isNaN(parseFloat(GlowingLookPrice1)) && isFinite(GlowingLookPrice1) ? Number(GlowingLookPrice1) : 0;
          var magicGlowLook2 = !isNaN(parseFloat(GlowingLookPrice2)) && isFinite(GlowingLookPrice2) ? Number(GlowingLookPrice2) : 0;
          var magicGlowLook3 = !isNaN(parseFloat(GlowingLookPrice3)) && isFinite(GlowingLookPrice3) ? Number(GlowingLookPrice3) : 0;

          s.magicPrice += magicGlowLook1 + magicGlowLook2 + magicGlowLook3;

          //console.log("SKU Glowing look");
          //console.log(s.data_items[i].sku);
          s.magicSum += 1;
        }

        //Lash bundle
        if (val.lashBundle.EMASXX8X1R22.exists && val.lashBundle.EMLLXX8X1R22.exists) {
          s.lashBundle += 1;
          var lashBundlePrice1 = val.lashBundle.EMASXX8X1R22.price;
          var lashBundlePrice2 = val.lashBundle.EMASXX8X1R22.price;

          var lashBundle1 = !isNaN(parseFloat(lashBundlePrice1)) && isFinite(lashBundlePrice1) ? Number(lashBundlePrice1) : 0;
          var lashBundle2 = !isNaN(parseFloat(lashBundlePrice2)) && isFinite(lashBundlePrice2) ? Number(lashBundlePrice2) : 0;

          s.magicPrice += lashBundle1 + lashBundle2;

          //console.log("SKU Lash bundle");
          //console.log(s.data_items[i].sku);
          s.magicSum += 1;
        }
      });

      // console.log("Magic Skin: " + s.magicSkinCount);
      // console.log("Magic Cream: " + s.magicCreamCount);
      // console.log("Glowing Look: " + s.glowingLook);
      // console.log("Lash Bundle: " + s.lashBundle);

    }
  };

  s.getorderitems = function() {


    var usedate1 = s.datetoday.toISOString().slice(0, 10);
    var usedate2 = s.datetoday2.toISOString().slice(0, 10);
    // console.log(usedate2);
    $http.get('/api/orderitemsbydates/' + usedate1 + '/' + usedate2).success(function(json) {
      // console.log(json);
    });
  };


  /*
s.getproducts = function(){
    $http.get('/api/getproducts/').success(function(json) {

    });

  }
*/
  var start = moment(s.datetoday)
  var end = moment(s.datetoday2)

  // console.log(start.startOf('day').toISOString(), end.endOf('day').toISOString())

  var query = {
    'date_created': {
      $gte: start.startOf('day').toISOString(),
      $lt: end.endOf('day').toISOString()
    }
  }

  query = JSON.stringify(query)

  console.log(query)
  var uriad = 'http://178.62.10.95/data/v1/collection/persons/records/?query=' + query + '&access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnQiOiJjaGFybG90dGV0aWxidXJ5IiwidXNlciI6InBhdHJpY2subWNraW5sZXlAZmFiYWN1cy5jb20iLCJ0b2tlbiI6IjFjMjQxNzEzOTNkYzVkZTA0ZmZjYjIxZjExODJhYjI4In0.Pks_8-TPmi0za0dXj1JBJMkmAG9vKy6yEivLYuTDRdg';

  $http.get(uriad).success(function(json) {
    $scope.data = json.data
    console.log(json)
  });

  // old functions
  $scope.lineDataset = [{
    data: visits,
    color: COLORS.success
  }];
  $scope.lineOptions = {
    series: {
      lines: {
        show: true,
        lineWidth: 1,
        fill: true
      },
      shadowSize: 0
    },
    grid: {
      color: COLORS.border,
      borderWidth: 0,
      hoverable: true,
    },
    xaxis: {
      min: 3,
      max: 23
    },
    yaxis: { // s.scope.lineOptions.yaxis.max
      min: 0,
      max: 10
    }
  };
  $scope.pieOptions = {
    series: {
      pie: {
        show: true,
        innerRadius: 0.5,
        stroke: {
          width: 2,
        },
        label: {
          show: true,
        }
      }
    },
    legend: {
      show: true
    },
  };
  $scope.barDataset = [{
    data: [
      ['M', 80],
      ['T', 40],
      ['W', 20],
      ['Th', 20],
      ['F', 50]
    ],
    bars: {
      show: true,
      barWidth: 0.6,
      align: 'center',
      fill: true,
      lineWidth: 0,
      fillColor: COLORS.
      default
    }
  }];
  $scope.barOptions = {
    grid: {
      hoverable: false,
      clickable: false,
      color: 'white',
      borderWidth: 0,
    },
    yaxis: {
      show: false
    },
    xaxis: {
      mode: 'categories',
      tickLength: 0,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 12,
      axisLabelFontFamily: 'Roboto',
      axisLabelPadding: 5
    }
  };
  var seriesData = [
    [],
    [],
    []
  ];
  var random = new Rickshaw.Fixtures.RandomData(150);
  for (var i = 0; i < 150; i++) {
    random.addData(seriesData);
  }
  $scope.options2 = {
    renderer: 'area',
    height: 250,
    padding: {
      top: 2,
      left: 0,
      right: 0,
      bottom: 0
    },
    interpolation: 'cardinal'
  };
  $scope.series = [{
    color: COLORS.primary,
    data: seriesData[0],
    name: 'Upload'
  }, {
    color: COLORS.bodyBg,
    data: seriesData[1],
    name: 'Download'
  }];
  $interval(function() {
    $scope.series = null;
    random.removeData(seriesData);
    random.addData(seriesData);
    $scope.series = [{
      data: seriesData[0],
    }, {
      data: seriesData[1],
    }];
  }, 1000);
  var seriesData2 = [
    [],
    [],
    []
  ];
  var random2 = new Rickshaw.Fixtures.RandomData(100);
  for (var v = 0; v < 100; v++) {
    random2.addData(seriesData2);
  }
  $scope.options5 = {
    renderer: 'area',
    height: 133,
    padding: {
      top: 2,
      left: 0,
      right: 0,
      bottom: 0
    },
    interpolation: 'cardinal',
    stroke: false,
    strokeWidth: 1,
    preserve: true,
  };
  $scope.features5 = {
    hover: {
      xFormatter: function(x) {
        return new Date(x * 1000).toString();
      },
      yFormatter: function(y) {
        return Math.round(y);
      }
    }
  };
  $scope.series5 = [{
    color: COLORS.success,
    name: 'Earnings',
    data: seriesData2[0]
  }];

});
