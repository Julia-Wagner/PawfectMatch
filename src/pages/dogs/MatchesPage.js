import React, {useEffect, useState} from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import {useLocation} from "react-router-dom";
import {axiosReq} from "../../api/axiosDefaults";
import Dog from "./Dog";
import {Accordion, Button, Form, Image} from "react-bootstrap";
import { useCurrentUser, useIsShelterUser } from "../../contexts/CurrentUserContext";

import NoResults from "../../assets/playground.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchMoreData} from "../../utils/utils";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import Sidebar from "../../components/Sidebar";
import {useFollowers} from "../../contexts/FollowersContext";

function MatchesPage({message, filter = ""}) {
    const [dogs, setDogs] = useState({results: []});
    const [hasLoaded, setHasLoaded] = useState(false);
    const [characteristics, setCharacteristics] = useState([]);
    const {pathname} = useLocation();

    const currentUser = useCurrentUser();
    const isShelterUser = useIsShelterUser();
    const {shouldUpdate} = useFollowers();

    const initialFilters = {
        gender: "",
        size: "",
        characteristics: []
    };

    const [filters, setFilters] = useState(initialFilters);
    const [accordionOpen, setAccordionOpen] = useState(false);

    const handleFilterChange = (event) => {
        const {name, value, type, checked} = event.target;
        if (type === "checkbox") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                characteristics: checked
                    ? [...prevFilters.characteristics, value]
                    : prevFilters.characteristics.filter((c) => c !== value)
            }));
        } else {
            setFilters({
                ...filters,
                [name]: value
            });
        }
    };

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const {data} = await axiosReq.get("/dogs/characteristics/");
                setCharacteristics(data.results);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCharacteristics();
    }, []);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                // add set filters to url query
                const params = new URLSearchParams();
                if (filters.gender) params.append('gender', filters.gender);
                if (filters.size) params.append('size', filters.size);
                if (filters.characteristics.length > 0) {
                    filters.characteristics.forEach(characteristic => {
                        params.append('characteristics', characteristic);
                    });
                }

                const { data } = await axiosReq.get(`/dogs/?is_adopted=false&${params.toString()}`);

                setDogs(data.results);
                setHasLoaded(true);
            } catch (err) {
                console.log(err)
            }
        }

        setHasLoaded(false);
        fetchDogs();
    }, [pathname, currentUser, shouldUpdate, isShelterUser, filters]);

    const resetFilters = () => {
        setFilters(initialFilters);
        setAccordionOpen(false)
        setHasLoaded(false);
        const fetchDogs = async () => {
            try {
                const {data} = await axiosReq.get(`/dogs/`);
                setDogs(data.results);
                setHasLoaded(true);
            } catch (err) {
                console.log(err)
            }
        }

        setHasLoaded(false);
        fetchDogs();
    }

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Accordion className={`mb-4 ${appStyles.Content}`} flush activeKey={accordionOpen ? "0" : null}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header onClick={() => setAccordionOpen(!accordionOpen)}>Filter your matches</Accordion.Header>
                            <Accordion.Body>
                                <Form>
                                    <Form.Group controlId="gender">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Select name="gender" value={filters.gender} onChange={handleFilterChange}>
                                            <option value="">All</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="size" className="mt-4">
                                        <Form.Label>Size</Form.Label>
                                        <Form.Select name="size" value={filters.size} onChange={handleFilterChange}>
                                            <option value="">All</option>
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="big">Big</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mt-4">
                                        <Form.Label>Characteristics</Form.Label>
                                        <div>
                                            {characteristics.map((characteristic) => (
                                                <Form.Check
                                                    key={characteristic.id}
                                                    id={`characteristic-${characteristic.id}`}
                                                    type="checkbox"
                                                    name="characteristics"
                                                    value={characteristic.id}
                                                    label={characteristic.characteristic}
                                                    onChange={handleFilterChange}
                                                    checked={filters.characteristics.includes(characteristic.id.toString())}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Form>
                                <div className="d-flex justify-content-end">
                                    <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`} onClick={resetFilters}>
                                        Reset all filters
                                    </Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    {hasLoaded ? (
                        <>
                            {dogs.length ? (
                                <InfiniteScroll
                                    children={
                                        dogs.map((dog) => (
                                        <Dog key={dog.id} {...dog} setDogs={setDogs} />
                                    ))}
                                    next={() => fetchMoreData(dogs, setDogs)}
                                    hasMore={!!dogs.next}
                                    loader={<Asset spinner />}
                                    dataLength={dogs.length}/>
                            ) : (
                                <Container className={appStyles.Content}>
                                    <h2 className="mt-3 mb-5 text-center">No dogs to display.</h2>
                                    <Image src={NoResults} alt="Dogs on a playground" />
                                </Container>
                            )}
                        </>
                    ) : (
                        <Container className={`text-center ${appStyles.Content}`}>
                            <Asset spinner />
                        </Container>
                    )}
                </Col>
                <Sidebar/>
            </Row>
        </Container>
    );
}

export default MatchesPage;