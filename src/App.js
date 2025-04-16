import axios from "axios";
import React, { Component } from "react";
import kotaFilter from './kota.json';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provinsiList: [],
      kotaList: [],
      provinsi: "",
      provinsiId: "",
    };

    this.kotaFilter = kotaFilter
  }

  componentDidMount() {
    this.getProvinsi();
  }

  async getProvinsi() {
    try {
      const res = await axios.get(
        "http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      if (res.data) {
        this.setState({ provinsiList: res.data });
      }
    } catch (err) {
      console.error("Gagal ambil data provinsi", err);
    }
  }

  async onProvinsiChange(e) {
    const selectedName = e.target.value;
    const selectedProv = this.state.provinsiList.find(
      (p) => p.name === selectedName
    );
    if (!selectedProv) return;

    this.setState({ provinsi: selectedName, provinsiId: selectedProv.id });

    try {
      const res = await axios.get(
        `http://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`
      );
      let kota = res.data;

      if (this.kotaFilter[selectedName]) {
        kota = kota.filter((k) =>
          this.kotaFilter[selectedName].includes(k.name)
        );
      }

      this.setState({ kotaList: kota });
    } catch (err) {
      console.error("Gagal ambil data kota", err);
    }
  }

  render() {
    return (
      <div className="container mt-4">
        <h4>Form Alamat</h4>

        <label>Provinsi</label>
        <select
          className="form-control mb-3"
          onChange={(e) => this.onProvinsiChange(e)}
        >
          <option value="">Pilih Provinsi</option>
          {this.state.provinsiList.map((prov) => (
            <option key={prov.id} value={prov.name}>
              {prov.name}
            </option>
          ))}
        </select>

        <label>Kabupaten/Kota</label>
        <select className="form-control">
          <option value="">Pilih Kota/Kabupaten</option>
          {this.state.kotaList.map((kota) => (
            <option key={kota.id} value={kota.name}>
              {kota.name}
            </option>
          ))}
        </select>

        <button className="btn btn-sm btn-primary w-100 mt-3">
          Submit
        </button>
      </div>
    );
  }
}

export default App;
