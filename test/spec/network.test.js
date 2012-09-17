define(['network'], function(Network) {

  describe('A* development', function () {

    // [id, name, lng, lat]
    var stationData = [[0, "a", 20, 5],
                       [1, "b", 32, 5],
                       [2, "c", 40, 10],
                       [3, "d", 7, 20],
                       [4, "e", 20, 20],
                       [5, "f", 32, 20],
                       [6, "g", 52, 20],
                       [7, "h", 20, 30],
                       [8, "i", 32, 30],
                       [9, "j", 40, 30],
                       [10, "k", 7, 40],
                       [11, "l", 20, 40],
                       [12, "m", 32, 40],
                       [13, "n", 50, 40],
                       [14, "o", 14, 50],
                       [15, "p", 20, 55],
                       [16, "q", 32, 55],
                       [17, "r", 50, 50],
                       [18, "s", 50, 55],
                       [19, "t", 60, 60],
                       [20, "u", 50, 65],
                       [21, "v", 50, 70],
                       [22, "w", 50, 70]]; // [22, "w", 48, 75]

    // [line name, line data, ...[connection data]]
    var connectionData = [["Alpha", {colour: "red"},
                           {direction: "S",
                            opposingDirection: "N", 
                            connections: [0, 4, 7, 11, 15]}],
                          ["Beta", {},
                           {direction: "S", 
                            opposingDirection: "N", 
                            connections: [1, 5, 8, 12, 16]}, 
                           {direction: "S", 
                            opposingDirection: "N", 
                            connections: [5, 9]}],
                          ["Delta", {},
                           {direction: "E", 
                            opposingDirection: "W", 
                            connections: [3, 4, 5, 6]}],
                          ["Kappa", {}, 
                           {direction: "E", 
                            opposingDirection: "W", 
                            connections: [10, 11, 12, 13]}],
                          ["Omicron", {},
                           {direction: "N", 
                            opposingDirection: "S", 
                            connections: [14, 11, 5, 2]}],
                          ["Psi", {},
                           {direction: "N", 
                            opposingDirection: "S", 
                            connections: [22, 21, 20, 19, 18, 17, 13]}],
                          ["Psi2", {},
                           {direction: "N", 
                            opposingDirection: "S", 
                            connections: [21, 22, 13]}]];

    var testtube = new Network(stationData, connectionData);
    var stations = testtube.stations;

    describe('line data', function() {
      it('should store data for the Alpha line', function () {
        expect(testtube.lineData["Alpha"].colour).to.equal("red");
      });
    });

    describe('buildStations', function () {
      it('should build all the Station objects', function () {
        expect(stations).to.be.a('object');
      });

      it('should fill the stations with sane values', function () {
        // sanity check
        var stationA = stations.a;
        expect(stationA.name).to.equal("a");
        expect(stationA.lng).to.equal(20);
        expect(stationA.lat).to.equal(5);
      });

      it('should build connection structures', function () {
        var stationA = stations.a;
        expect(stationA.connections).to.have.length(1);

        var conn = stationA.connections[0];
        expect(conn.line).to.equal("Alpha");
        expect(conn.direction).to.equal("S");
        expect(conn.dest.name).to.equal("e");
      });


    });


    describe('travelTime', function () {
      var testtube = new Network([], []);

      it('should calculate straight line travelTime', function () {
        var a = stations.a;
        var b = stations.b;
        expect(testtube._travelTime(a, b)).to.equal(12);
      });
    });


    function expectedRoute(from, to, expected) {
      var i;
      var r = testtube.route(from, to);
      var arr = r.path.map(function(s) {return s.name;});

      expect(r.success).to.be.true;

      expect(arr).to.have.length(expected.length);
      for(i=0;i<expected.length;i++) {
        expect(arr[i]).to.equal(expected[i]);
      }
    }

    describe('route', function() {
      it('should find a valid route', function () {
        expectedRoute("a", "e", ["a", "e"]);

        expectedRoute("a", "i", ["a", "e", "f", "i"]);
        expectedRoute("o", "i", ["o", "l", "m", "i"]);
        expectedRoute("l", "j", ["l", "f", "j"]);
        expectedRoute("d", "n", ["d", "e", "f", "i", "m", "n"]);

      });

      it('should find a valid route for stations in a different case', function () {
        expectedRoute("A", "E", ["a", "e"]);
        expectedRoute("A", "I", ["a", "e", "f", "i"]);
        expectedRoute("O", "I", ["o", "l", "m", "i"]);
        expectedRoute("L", "J", ["l", "f", "j"]);
        expectedRoute("D", "N", ["d", "e", "f", "i", "m", "n"]);
      });

      describe('pathalogial psi route', function() {
        it('find a sensible route between n and w', function () {
          expectedRoute("n", "v", ["n", "w", "v"]);
        });
      });


      it('should return an error when given unknown stations', function() {
        var r = testtube.route("fakeStation1", "fakeStation2");
        expect(r.success).to.be.false;

        r = testtube.route("fakeStation1", "b");
        expect(r.success).to.be.false;
        expect(r.message).to.equal("unknown starting station: fakeStation1");

        r = testtube.route("a", "fakeStation2");
        expect(r.success).to.be.false;
        expect(r.message).to.equal("unknown destination station: fakeStation2");
      });


    });


  })


});